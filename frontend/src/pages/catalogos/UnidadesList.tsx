import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Subunidad {
  idUnidad: number;
  categoria: string;
  icono: string;
  idSubunidad: number;
  nombre: string;
  simbolo: string;
  uso: string;
}

const UNIDADES_DATA: Subunidad[] = [
  
  { idUnidad: 1, categoria: 'Masa', icono: '⚖️', idSubunidad: 1, nombre: 'Tonelada', simbolo: 't', uso: 'Movimiento de tierra, producción' },
  { idUnidad: 1, categoria: 'Masa', icono: '⚖️', idSubunidad: 2, nombre: 'Kilogramo', simbolo: 'kg', uso: 'Producto final, concentrados' },
  { idUnidad: 1, categoria: 'Masa', icono: '⚖️', idSubunidad: 3, nombre: 'Gramo', simbolo: 'g', uso: 'Producto final (oro)' },
  
  { idUnidad: 2, categoria: 'Ley / Concentración', icono: '🧪', idSubunidad: 4, nombre: 'Gramos por Tonelada', simbolo: 'g/t', uso: 'Ley de mineral (principal)' },
  { idUnidad: 2, categoria: 'Ley / Concentración', icono: '🧪', idSubunidad: 5, nombre: 'Miligramos por Kilogramo', simbolo: 'mg/kg', uso: 'Equivalente a ppm' },
  { idUnidad: 2, categoria: 'Ley / Concentración', icono: '🧪', idSubunidad: 6, nombre: 'Partes por Millón', simbolo: 'ppm', uso: 'Análisis químicos (1 ppm = 1 mg/kg)' },
  { idUnidad: 2, categoria: 'Ley / Concentración', icono: '🧪', idSubunidad: 7, nombre: 'Porcentaje', simbolo: '%', uso: 'Pureza en fundición' },

  { idUnidad: 3, categoria: 'Volumen y Densidad', icono: '📦', idSubunidad: 8, nombre: 'Metro Cúbico', simbolo: 'm³', uso: 'Pilas, patios, calibre de cucharón' },
  { idUnidad: 3, categoria: 'Volumen y Densidad', icono: '📦', idSubunidad: 9, nombre: 'Tonelada por Metro Cúbico', simbolo: 't/m³', uso: 'Densidad de material' },
  
  { idUnidad: 4, categoria: 'Longitud / Coordenadas', icono: '📏', idSubunidad: 10, nombre: 'Metro', simbolo: 'm', uso: 'Distancias, profundidad' },
  { idUnidad: 4, categoria: 'Longitud / Coordenadas', icono: '📏', idSubunidad: 11, nombre: 'Grados Decimales', simbolo: '° (decimal)', uso: 'Coordenadas GPS (lat/lon)' },
  { idUnidad: 4, categoria: 'Longitud / Coordenadas', icono: '📏', idSubunidad: 12, nombre: 'Precisión GPS', simbolo: 'm', uso: 'Margen de error GPS' },
  
  { idUnidad: 5, categoria: 'Tiempo', icono: '⏱️', idSubunidad: 13, nombre: 'Hora', simbolo: 'h', uso: 'Duración de operaciones' },
  { idUnidad: 5, categoria: 'Tiempo', icono: '⏱️', idSubunidad: 14, nombre: 'Minuto', simbolo: 'min', uso: 'Tiempos cortos' },
  { idUnidad: 5, categoria: 'Tiempo', icono: '⏱️', idSubunidad: 15, nombre: 'Segundo', simbolo: 's', uso: 'Mediciones precisas' },
  { idUnidad: 5, categoria: 'Tiempo', icono: '⏱️', idSubunidad: 16, nombre: 'Formato Fecha/Hora', simbolo: 'ISO-8601', uso: 'Timestamps, registros' },

  { idUnidad: 6, categoria: 'Rendimiento / Tasa', icono: '⚡', idSubunidad: 17, nombre: 'Toneladas por Hora', simbolo: 't/h', uso: 'Productividad de planta' },
  { idUnidad: 6, categoria: 'Rendimiento / Tasa', icono: '⚡', idSubunidad: 18, nombre: 'Kilogramos por Hora', simbolo: 'kg/h', uso: 'Tasas menores' },

  { idUnidad: 7, categoria: 'Conteos Operativos', icono: '🔢', idSubunidad: 19, nombre: 'Cucharón de Extracción', simbolo: 'cucharon_ext', uso: 'Conteo de cucharones (adimensional)' },
  { idUnidad: 7, categoria: 'Conteos Operativos', icono: '🔢', idSubunidad: 20, nombre: 'Cucharón de Producción', simbolo: 'cucharon_prod', uso: 'Conteo de cucharones (adimensional)' },
  { idUnidad: 7, categoria: 'Conteos Operativos', icono: '🔢', idSubunidad: 21, nombre: 'Dompada', simbolo: 'dompada', uso: 'Conteo de viajes de camión' },

  { idUnidad: 8, categoria: 'Producto Final', icono: '💎', idSubunidad: 22, nombre: 'Gramos de Oro', simbolo: 'g_oro', uso: 'Producción final de oro' },
  { idUnidad: 8, categoria: 'Producto Final', icono: '💎', idSubunidad: 23, nombre: 'Kilogramos de Concentrado', simbolo: 'kg_concentrado', uso: 'Concentrado mineral' },
];

export default function UnidadesList() {
  const [busqueda, setBusqueda] = useState('');
  const unidadesFiltradas = UNIDADES_DATA.filter((u) => {
    const termino = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(termino) ||
      u.simbolo.toLowerCase().includes(termino) ||
      u.uso.toLowerCase().includes(termino) ||
      u.categoria.toLowerCase().includes(termino)
    );
  });

  const categoriasAgrupadas = unidadesFiltradas.reduce((acc: Record<string, { icono: string, items: Subunidad[] }>, curr) => {
    if (!acc[curr.categoria]) {
      acc[curr.categoria] = { icono: curr.icono, items: [] };
    }
    acc[curr.categoria].items.push(curr);
    return acc;
  }, {});

  const exportarAExcel = () => {
    const datosParaExcel = unidadesFiltradas.map(u => ({
      'Categoría': u.categoria,
      'ID Unidad': u.idUnidad,
      'ID Subunidad': u.idSubunidad,
      'Nombre Subunidad': u.nombre,
      'Símbolo': u.simbolo,
      'Uso Principal': u.uso
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unidades_Medida");
    XLSX.writeFile(workbook, "Catalogo_Unidades_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Catálogo de Unidades de Medida - SistemaMine", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = unidadesFiltradas.map(u => [
      u.categoria,
      u.nombre,
      u.simbolo,
      u.uso
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Categoría', 'Unidad / Subunidad', 'Símbolo', 'Uso Principal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    doc.save("Catalogo_Unidades_SistemaMine.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'white' }}>
      
      <div className="page-header">
        <h1 className="page-title">Catálogo Completo de Unidades</h1>
        <p className="page-subtitle">Vista detallada de todas las unidades y subunidades del sistema</p>
      </div>

      <div className="page-content">
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filtrar por nombre, símbolo o categoría..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '2px solid var(--gray-200)', borderRadius: '8px' }}
            />
          </div>
          <div className="toolbar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ color: '#047857', borderColor: '#10b981' }}>
              <span>📊</span> Exportar Excel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ color: '#b91c1c', borderColor: '#ef4444' }}>
              <span>📄</span> Exportar PDF
            </button>
          </div>
        </div>

        {Object.keys(categoriasAgrupadas).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)', background: 'var(--gray-50)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
            No se encontraron unidades que coincidan con "{busqueda}".
          </div>
        )}

        {Object.entries(categoriasAgrupadas).map(([categoria, info]) => (
          <div key={categoria} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0', color: 'var(--gray-800)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>{info.icono}</span>
              <span>{categoria}</span>
            </h2>

            <div className="table-container" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--gray-50)' }}>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>ID Unidad</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Unidad de Medida</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>ID Subunidad</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Nombre Subunidad</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Símbolo</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Uso Principal</th>
                  </tr>
                </thead>
                <tbody>
                  {info.items.map((sub, index) => (
                    <tr key={sub.idSubunidad} style={{ borderBottom: index === info.items.length - 1 ? 'none' : '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '1rem' }}>{sub.idUnidad}</td>
                      <td style={{ padding: '1rem' }}><strong>{sub.categoria}</strong></td>
                      <td style={{ padding: '1rem' }}>{sub.idSubunidad}</td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{sub.nombre}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontFamily: 'monospace', background: 'var(--gray-100)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--primary-blue)', fontWeight: 'bold' }}>
                          {sub.simbolo}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{sub.uso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}