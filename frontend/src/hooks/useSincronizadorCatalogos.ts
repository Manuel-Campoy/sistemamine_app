import { useEffect } from 'react';
import api from '../api/axiosConfig';
import { localDb } from '../db/localDb';

export default function useSincronizadorCatalogos(isOnline: boolean) {
  useEffect(() => {
    if (!isOnline) return;

    const descargarCatalogos = async () => {
      try {

        const [resVehiculos, resUsuarios, resLotes] = await Promise.all([
          api.get('/vehiculos').catch(() => ({ data: [] })),
          api.get('/usuarios').catch(() => ({ data: [] })),
          api.get('/prospeccion').catch(() => ({ data: [] }))
        ]);

        if (resVehiculos.data.length > 0) {
          await localDb.vehiculos.clear();
          await localDb.vehiculos.bulkPut(resVehiculos.data.map((v: any) => ({
            idvehiculo: v.idvehiculo,
            numeroeconomico: v.numeroeconomico,
            marca: v.marca
          })));
        }

        if (resUsuarios.data.length > 0) {
          await localDb.usuarios.clear();
          await localDb.usuarios.bulkPut(resUsuarios.data.map((u: any) => ({
            idusuario: u.idusuario,
            nombre: u.nombre,
            rol: u.rol
          })));
        }

        if (resLotes.data.length > 0) {
          const lotesAutorizados = resLotes.data.filter((l: any) => l.estatus?.descripcion === 'Autorizado Para Movimiento');
          await localDb.lotes.clear();
          await localDb.lotes.bulkPut(lotesAutorizados.map((l: any) => ({
            idarealote: l.idarealote,
            nombrealias: l.nombrealias,
            tonelajeestimado: Number(l.tonelajeestimado) || 0
          })));
        }

        console.log("Catálogos sincronizados en segundo plano para uso Offline.");

      } catch (error) {
        console.error("Error crítico en la sincronización silenciosa:", error);
      }
    };

    descargarCatalogos();

  }, [isOnline]); 
}