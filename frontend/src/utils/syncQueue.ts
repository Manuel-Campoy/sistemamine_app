/**
 * ✅ PUNTO 5: Utilidades para gestionar la cola de sincronización persistente
 * Proporciona funciones para:
 * - Guardar/cargar cola de sincronización desde localStorage
 * - Recuperar estado de sincronización al iniciar la app
 * - Limpiar cola después de sincronización exitosa
 * - Registrar intentos fallidos
 */

export interface SyncQueueItem {
  idmovimiento: string;
  timestamp: number;
  accion: 'crear' | 'actualizar' | 'eliminar';
  razon_fallo?: string;
  intentos?: number;
}

const STORAGE_KEY = 'sincronizacion_cola';
const SYNC_STATE_KEY = 'sincronizacion_estado';

export interface SyncState {
  ultimaSincronizacion: number | null;
  totalItemsSync: number;
  totalItemsFallo: number;
  estado: 'pendiente' | 'sincronizando' | 'completado' | 'error';
}

/**
 * Obtiene la cola actual de localStorage
 */
export function obtenerCola(): SyncQueueItem[] {
  try {
    const cola = localStorage.getItem(STORAGE_KEY);
    return cola ? JSON.parse(cola) : [];
  } catch (error) {
    console.error('Error al cargar cola de sincronización:', error);
    return [];
  }
}

/**
 * Guarda la cola en localStorage
 */
export function guardarCola(cola: SyncQueueItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cola));
  } catch (error) {
    console.error('Error al guardar cola de sincronización:', error);
  }
}

/**
 * Agregar un item a la cola
 */
export function agregarAlaCola(item: SyncQueueItem): void {
  const cola = obtenerCola();
  cola.push(item);
  guardarCola(cola);
}

/**
 * Remover un item de la cola por ID
 */
export function removerDeLaCola(idmovimiento: string): void {
  const cola = obtenerCola();
  const nuevaCola = cola.filter(item => item.idmovimiento !== idmovimiento);
  guardarCola(nuevaCola);
}

/**
 * Limpiar toda la cola
 */
export function limpiarCola(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Obtener estado de sincronización
 */
export function obtenerEstadoSync(): SyncState {
  try {
    const estado = localStorage.getItem(SYNC_STATE_KEY);
    return estado ? JSON.parse(estado) : {
      ultimaSincronizacion: null,
      totalItemsSync: 0,
      totalItemsFallo: 0,
      estado: 'pendiente'
    };
  } catch (error) {
    console.error('Error al cargar estado de sincronización:', error);
    return {
      ultimaSincronizacion: null,
      totalItemsSync: 0,
      totalItemsFallo: 0,
      estado: 'pendiente'
    };
  }
}

/**
 * Actualizar estado de sincronización
 */
export function actualizarEstadoSync(estado: Partial<SyncState>): void {
  try {
    const estadoActual = obtenerEstadoSync();
    const nuevoEstado: SyncState = { ...estadoActual, ...estado };
    localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(nuevoEstado));
  } catch (error) {
    console.error('Error al actualizar estado de sincronización:', error);
  }
}

/**
 * Incrementar contador de sincronizaciones exitosas
 */
export function incrementarSincExitosas(): void {
  const estado = obtenerEstadoSync();
  estado.totalItemsSync++;
  estado.ultimaSincronizacion = Date.now();
  actualizarEstadoSync(estado);
}

/**
 * Incrementar contador de fallos
 */
export function incrementarFallos(): void {
  const estado = obtenerEstadoSync();
  estado.totalItemsFallo++;
  actualizarEstadoSync(estado);
}

/**
 * Resetear contadores
 */
export function resetearContadores(): void {
  actualizarEstadoSync({
    totalItemsSync: 0,
    totalItemsFallo: 0,
    estado: 'pendiente'
  });
}

/**
 * ✅ PUNTO 2: Detectar conflictos basado en timestamps
 * Compara el timestamp local con uno del servidor para determinar conflictos
 */
export function detectarConflicto(
  timestampLocal: number,
  timestampServidor: number | null
): boolean {
  // Si no hay timestamp del servidor, no hay conflicto
  if (!timestampServidor) return false;

  // Si el timestamp local es posterior, es un cambio local válido
  if (timestampLocal > timestampServidor) return false;

  // Si son iguales o el servidor es más reciente, hay potencial conflicto
  return true;
}

/**
 * ✅ PUNTO 2: Resolver conflicto usando Last-Write-Wins
 * El documento más reciente (por timestamp) gana
 */
export function resolverConflictoLWW(
  timestampLocal: number,
  timestampServidor: number
): 'local' | 'servidor' {
  return timestampLocal > timestampServidor ? 'local' : 'servidor';
}

/**
 * Obtener resumen de la cola
 */
export function obtenerResumenCola(): {
  total: number;
  porProcesar: number;
  conErrores: number;
} {
  const cola = obtenerCola();
  return {
    total: cola.length,
    porProcesar: cola.filter(item => !item.razon_fallo).length,
    conErrores: cola.filter(item => item.razon_fallo).length
  };
}
