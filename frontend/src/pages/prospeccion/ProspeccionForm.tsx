import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import localforage from "localforage";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../hooks/useNotification";

interface Coordenada {
  lat: number;
  lng: number;
  timestamp: string;
}
interface MediaFile {
  id: string;
  tipo: "foto" | "video";
  url: string;
  file?: File;
}

export default function ProspeccionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, loading } = useNotification();
  const [errorMsg, setErrorMsg] = useState("");

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendientesSync, setPendientesSync] = useState(0); 

  const [nombrealias, setAlias] = useState("");
  const [idmina, setIdMina] = useState("");
  const [metodomuestreo, setMetodo] = useState("");
  const [leyestimada, setLey] = useState("");
  const [tonelajeestimado, setTonelaje] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idestatusprospeccion, setEstatus] = useState("");
  const [coordenadas, setCoordenadas] = useState<Coordenada[]>([]);
  const [multimedia, setMultimedia] = useState<MediaFile[]>([]);
  const [minasList, setMinasList] = useState<any[]>([]);
  const [estatusList, setEstatusList] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); sincronizarOffline(); };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    cargarMinas();
    cargarEstatus();
    verificarOffline();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const verificarOffline = async () => {
    const queue: any[] = await localforage.getItem("prospeccionSyncQueue") || [];
    setPendientesSync(queue.length);
  };

  const sincronizarOffline = async () => {
    const queue: any[] = await localforage.getItem("prospeccionSyncQueue") || [];
    if (queue.length === 0) return;

    loading(`Subiendo ${queue.length} lotes a la nube...`, 'sync');
    try {
      for (const item of queue) {
        if (item.action === 'PUT' && item.loteId) {
          await api.put(`/prospeccion/${item.loteId}`, item.payload);
        } else {
          await api.post("/prospeccion", item.payload);
        }
      }
      await localforage.removeItem("prospeccionSyncQueue");
      setPendientesSync(0);
      success('¡Sincronización de lotes exitosa!', { id: 'sync' });
    } catch (err) {
      error('Falló la sincronización automática. Revisa tu conexión.', { id: 'sync' });
    }
  };

  const cargarMinas = async () => {
    try {
      const res = await api.get("/minas"); 
      setMinasList(res.data.data || []);
      if (res.data.length > 0 && !id) {
        setIdMina(res.data[0].idmina);
      }
    } catch (err) {
      console.warn("No se pudieron cargar las minas", err);
    }
  };

  const cargarEstatus = async () => {
    try {
      const res = await api.get("/prospeccion/estatus-prospeccion");
      setEstatusList(res.data.data || []);

      if (res.data.length > 0 && !id) {
        setEstatus(res.data[0].idestatusprospeccion);
      }
    } catch (err) {
      console.warn("No se pudieron cargar los estatus", err);
    }
  };

  const onDropFotos = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    try {
      const nuevasFotos = await Promise.all(
        acceptedFiles.map(async (file) => {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          const base64Url =
            await imageCompression.getDataUrlFromFile(compressedFile);

          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            tipo: "foto" as const,
            url: base64Url,
          };
        }),
      );
      setMultimedia((prev) => [...prev, ...nuevasFotos]);
    } catch (err) {
      setErrorMsg("Error al procesar las imágenes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps: getFotoRootProps, getInputProps: getFotoInputProps } =
    useDropzone({
      onDrop: onDropFotos,
      accept: { "image/*": [] },
    });

  const onDropVideos = useCallback((acceptedFiles: File[]) => {
    setIsLoading(true);
    const maxSize = 50 * 1024 * 1024;

    acceptedFiles.forEach((file) => {
      if (file.size > maxSize) {
        alert(`El video ${file.name} supera los 50MB permitidos.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const nuevoVideo: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          tipo: "video",
          url: reader.result as string,
        };
        setMultimedia((prev) => [...prev, nuevoVideo]);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      onDrop: onDropVideos,
      accept: { "video/*": [] },
    });

  const eliminarMedia = (id: string) => {
    setMultimedia(multimedia.filter((m) => m.id !== id));
  };

  const capturarGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocalización no soportada por este dispositivo.");
      return;
    }
    setIsLoading(true);
    loading("Buscando satélites...", 'gps');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordenadas([
          ...coordenadas,
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString(),
          },
        ]);
        success("Punto GPS capturado", { id: 'gps' });
        setIsLoading(false);
      },
      (gpsError) => {
        setErrorMsg(`Error GPS: ${gpsError.message}`);
        error("Falló la captura GPS", { id: 'gps' });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  useEffect(() => {
    if (isEditing) cargarLote();
  }, [id]);

  const cargarLote = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/prospeccion/${id}`);
      const data = response.data;

      setIdMina(data.idmina || "");
      setAlias(data.nombrealias || "");
      setEstatus(data.idestatusprospeccion || "");
      setMetodo(data.metodomuestreo || "");
      setLey(data.leyestimada ? data.leyestimada.toString() : "");
      setTonelaje(
        data.tonelajeestimado ? data.tonelajeestimado.toString() : "",
      );
      setObservaciones(data.observaciones || "");
      setCoordenadas(
        typeof data.coordenadas === "string"
          ? JSON.parse(data.coordenadas)
          : data.coordenadas || [],
      );
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error ||
        "Error al cargar el lote desde el servidor",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    if (!user || !user.id) {
      setIsLoading(false);
      return setErrorMsg("Error de autenticación. Por favor, inicia sesión nuevamente.");
    }
    if (!idmina) {
      setIsLoading(false);
      return setErrorMsg("Por favor, selecciona a qué Mina pertenece este lote.");
    }
    if (!idestatusprospeccion || idestatusprospeccion === "") {
      setIsLoading(false);
      return setErrorMsg("Por favor, selecciona el Estatus del Lote.");
    }

    const payload = {
      idmina: idmina,
      idresponsable: user.id,
      idestatusprospeccion: idestatusprospeccion,
      nombrealias,
      fechayhoramuestreo: new Date().toISOString(),
      metodomuestreo,
      leyestimada: leyestimada ? parseFloat(leyestimada) : null,
      tonelajeestimado: tonelajeestimado ? parseFloat(tonelajeestimado) : null,
      observaciones,
      coordenadas: coordenadas,
    };

    if (!isOnline) {
      try {
        const queue: any[] = (await localforage.getItem("prospeccionSyncQueue")) || [];
        queue.push({
          id: Date.now().toString(),
          loteId: isEditing ? id : null, 
          action: isEditing ? "PUT" : "POST",
          payload,
        });
        await localforage.setItem("prospeccionSyncQueue", queue);
        setPendientesSync(queue.length); 

        setIsLoading(false);
        success("Guardado en la memoria de la Tablet. Se sincronizará al tener red.", { icon: '💾', duration: 4000 });
        navigate("/dashboard/prospeccion");
      } catch (err) {
        setErrorMsg("Error al guardar offline. La memoria podría estar llena.");
        setIsLoading(false);
      }
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/prospeccion/${id}`, payload);
        success("Lote actualizado correctamente");
      } else {
        await api.post("/prospeccion", payload);
        success("Lote registrado en el servidor central");
      }
      navigate("/dashboard/prospeccion");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const fotos = multimedia.filter((m) => m.tipo === "foto");
  const videos = multimedia.filter((m) => m.tipo === "video");

  return (
    <div
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        background: "white",
      }}
    >
      {!isOnline && (
        <div
          style={{
            background: "#f59e0b",
            color: "white",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
            borderRadius: "8px 8px 0 0",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span>⚠️ MODO OFFLINE. Los datos se guardarán en la Tablet.</span>
          <span>{pendientesSync > 0 ? `⏳ ${pendientesSync} pendientes de envío` : ''}</span>
        </div>
      )}

      <div
        className="page-header"
        style={{ padding: "2rem", borderBottom: "2px solid var(--gray-200)" }}
      >
        <h1
          className="page-title"
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {isEditing ? "Evaluar Lote" : "Registrar Nuevo Lote"}
        </h1>
        <p className="page-subtitle">
          Captura de datos en campo y análisis geológico
        </p>
      </div>

      <div className="page-content" style={{ padding: "2rem" }}>
        {errorMsg && (
          <div
            className="alert alert-error"
            style={{
              marginBottom: "1rem",
              background: "#fee2e2",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <div
          className="tabs"
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "2px solid var(--gray-200)",
            marginBottom: "2rem",
            overflowX: "auto",
          }}
        >
          {["general", "gps", "multimedia", "evaluacion"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1rem",
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "3px solid var(--primary-blue)"
                    : "3px solid transparent",
                color:
                  activeTab === tab ? "var(--primary-blue)" : "var(--gray-600)",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab === "general"
                ? "⛏️ Datos de Campo"
                : tab === "gps"
                  ? "📍 Coordenadas"
                  : tab === "multimedia"
                    ? "📷 Fotos/Videos"
                    : "📊 Evaluación"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "general" && (
            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="idmina" className="form-label required">
                  Mina / Complejo Operativo
                </label>
                <select
                  id="idmina"
                  name="idmina"
                  className="form-select"
                  value={idmina}
                  onChange={(e) => setIdMina(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">Seleccionar Mina...</option>
                  {minasList.map((m) => (
                    <option key={m.idmina} value={m.idmina}>
                      {m.aliasmina} ({m.claveminera})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="nombrealias" className="form-label required">
                  Nombre o Alias del Lote
                </label>
                <input
                  id="nombrealias"
                  name="nombrealias"
                  type="text"
                  required
                  className="form-input"
                  value={nombrealias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Ej: Veta Norte - Nivel 3"
                />
              </div>

              <div>
                <label htmlFor="metodomuestreo" className="form-label">
                  Método de Muestreo
                </label>
                <select
                  id="metodomuestreo"
                  name="metodomuestreo"
                  className="form-select"
                  value={metodomuestreo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Canal">Muestreo por Canal</option>
                  <option value="Batea">Muestreo en Batea</option>
                  <option value="Suelo">Suelo / Sedimentos</option>
                </select>
              </div>

              <div>
                <label htmlFor="fechasistema" className="form-label">
                  Fecha del Sistema
                </label>
                <input
                  id="fechasistema"
                  name="fechasistema"
                  type="text"
                  className="form-input"
                  disabled
                  value={new Date().toLocaleDateString()}
                />
              </div>
            </div>
          )}

          {activeTab === "gps" && (
            <div style={{ animation: "fadeIn 0.3s" }}>
              <div
                style={{
                  background: "#eff6ff",
                  border: "2px dashed #3b82f6",
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
                <h4
                  style={{
                    fontWeight: 600,
                    color: "#1e40af",
                    marginBottom: "0.5rem",
                  }}
                >
                  Captura de Puntos GPS
                </h4>
                <p
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  Párate en los vértices del lote y presiona capturar.
                </p>
                <button
                  type="button"
                  onClick={capturarGPS}
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    background: "#2563eb",
                    margin: "0 auto",
                    maxWidth: "300px",
                  }}
                >
                  📡 Capturar Ubicación Actual
                </button>
              </div>

              {coordenadas.length > 0 && (
                <div
                  style={{
                    border: "1px solid var(--gray-200)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead style={{ background: "var(--gray-50)" }}>
                      <tr>
                        <th
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid var(--gray-200)",
                          }}
                        >
                          Punto
                        </th>
                        <th
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid var(--gray-200)",
                          }}
                        >
                          Latitud
                        </th>
                        <th
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid var(--gray-200)",
                          }}
                        >
                          Longitud
                        </th>
                        <th
                          style={{
                            padding: "1rem",
                            borderBottom: "1px solid var(--gray-200)",
                          }}
                        >
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordenadas.map((c, i) => (
                        <tr
                          key={i}
                          style={{ borderBottom: "1px solid var(--gray-200)" }}
                        >
                          <td style={{ padding: "1rem", fontWeight: 600 }}>
                            P-{i + 1}
                          </td>
                          <td
                            style={{
                              padding: "1rem",
                              color: "var(--primary-blue)",
                              fontFamily: "monospace",
                            }}
                          >
                            {c.lat.toFixed(6)}°
                          </td>
                          <td
                            style={{
                              padding: "1rem",
                              color: "var(--primary-blue)",
                              fontFamily: "monospace",
                            }}
                          >
                            {c.lng.toFixed(6)}°
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <button
                              type="button"
                              onClick={() =>
                                setCoordenadas(
                                  coordenadas.filter((_, idx) => idx !== i),
                                )
                              }
                              style={{
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "none",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "multimedia" && (
            <div style={{ animation: "fadeIn 0.3s" }}>
              <label className="form-label">
                Fotografías del Área (Solo localmente por ahora)
              </label>
              <div
                {...getFotoRootProps()}
                style={{
                  border: "2px dashed var(--gray-300)",
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  background: "var(--gray-50)",
                  cursor: "pointer",
                  marginBottom: "1rem",
                }}
              >
                <input {...getFotoInputProps()} />
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📷
                </div>
                <div style={{ fontWeight: 600, color: "var(--gray-700)" }}>
                  Toca para abrir la cámara o selecciona imágenes
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--gray-500)",
                    marginTop: "0.5rem",
                  }}
                >
                  Las imágenes se comprimirán para ahorrar datos en campo.
                </div>
              </div>
              {fotos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  {fotos.map((foto) => (
                    <div
                      key={foto.id}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid var(--gray-200)",
                      }}
                    >
                      <img
                        src={foto.url}
                        alt="Evidencia"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarMedia(foto.id)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "var(--danger-red)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="form-label">Videos</label>
              <div
                {...getVideoRootProps()}
                style={{
                  border: "2px dashed var(--gray-300)",
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  background: "var(--gray-50)",
                  cursor: "pointer",
                  marginBottom: "1rem",
                }}
              >
                <input {...getVideoInputProps()} />
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  🎥
                </div>
                <div style={{ fontWeight: 600, color: "var(--gray-700)" }}>
                  Toca para grabar video
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--gray-500)",
                    marginTop: "0.5rem",
                  }}
                >
                  Máximo 50MB por archivo.
                </div>
              </div>
              {videos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid var(--gray-200)",
                        background: "black",
                      }}
                    >
                      <video
                        src={vid.url}
                        controls
                        style={{ width: "100%", height: "100%" }}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarMedia(vid.id)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "var(--danger-red)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "evaluacion" && (
            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  gridColumn: "1 / -1",
                  background: "#eff6ff",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #bfdbfe",
                }}
              >
                <label
                  htmlFor="idestatusprospeccion"
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "#1e40af",
                    marginBottom: "0.5rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Estatus del Lote
                </label>
                <select
                  id="idestatusprospeccion"
                  name="idestatusprospeccion"
                  className="form-select"
                  value={idestatusprospeccion}
                  onChange={(e) => setEstatus(e.target.value)}
                  style={{ fontWeight: "bold", background: "white" }}
                  required
                >
                  <option value="">Seleccionar Estatus...</option>
                  {estatusList.map((est) => (
                    <option
                      key={est.idestatusprospeccion}
                      value={est.idestatusprospeccion}
                    >
                      {est.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="leyestimada" className="form-label">
                  Ley Estimada (g/t o %)
                </label>
                <input
                  id="leyestimada"
                  name="leyestimada"
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={leyestimada}
                  onChange={(e) => setLey(e.target.value)}
                  placeholder="Ej: 2.50"
                />
              </div>

              <div>
                <label htmlFor="tonelajeestimado" className="form-label">
                  Tonelaje Estimado (t)
                </label>
                <input
                  id="tonelajeestimado"
                  name="tonelajeestimado"
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={tonelajeestimado}
                  onChange={(e) => setTonelaje(e.target.value)}
                  placeholder="Ej: 50000"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="observaciones" className="form-label">
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  className="form-input"
                  rows={4}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Análisis estructural..."
                ></textarea>
              </div>
            </div>
          )}

          <div
            style={{
              background: "var(--gray-50)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
              {isOnline
                ? "🌐 Conexión estable con el servidor"
                : "💾 Los datos se guardarán en la memoria interna de la Tablet"}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard/prospeccion")}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  background: isOnline ? "var(--success-green)" : "#f59e0b",
                  borderColor: isOnline ? "var(--success-green)" : "#f59e0b",
                }}
              >
                {isLoading
                  ? "Guardando..."
                  : isOnline
                    ? "✓ Registrar en Servidor"
                    : "💾 Guardar en Tablet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}