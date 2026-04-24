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

export function obtenerCola(): SyncQueueItem[] {
  try {
    const cola = localStorage.getItem(STORAGE_KEY);
    return cola ? JSON.parse(cola) : [];
  } catch (error) {
    console.error('Error al cargar cola de sincronización:', error);
    return [];
  }
}

export function guardarCola(cola: SyncQueueItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cola));
  } catch (error) {
    console.error('Error al guardar cola de sincronización:', error);
  }
}

export function agregarAlaCola(item: SyncQueueItem): void {
  const cola = obtenerCola();
  cola.push(item);
  guardarCola(cola);
}

export function removerDeLaCola(idmovimiento: string): void {
  const cola = obtenerCola();
  const nuevaCola = cola.filter(item => item.idmovimiento !== idmovimiento);
  guardarCola(nuevaCola);
}

export function limpiarCola(): void {
  localStorage.removeItem(STORAGE_KEY);
}

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

export function actualizarEstadoSync(estado: Partial<SyncState>): void {
  try {
    const estadoActual = obtenerEstadoSync();
    const nuevoEstado: SyncState = { ...estadoActual, ...estado };
    localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(nuevoEstado));
  } catch (error) {
    console.error('Error al actualizar estado de sincronización:', error);
  }
}

export function incrementarSincExitosas(): void {
  const estado = obtenerEstadoSync();
  estado.totalItemsSync++;
  estado.ultimaSincronizacion = Date.now();
  actualizarEstadoSync(estado);
}

export function incrementarFallos(): void {
  const estado = obtenerEstadoSync();
  estado.totalItemsFallo++;
  actualizarEstadoSync(estado);
}

export function resetearContadores(): void {
  actualizarEstadoSync({
    totalItemsSync: 0,
    totalItemsFallo: 0,
    estado: 'pendiente'
  });
}

export function detectarConflicto(
  timestampLocal: number,
  timestampServidor: number | null
): boolean {
  if (!timestampServidor) return false;

  if (timestampLocal > timestampServidor) return false;

  return true;
}

export function resolverConflictoLWW(
  timestampLocal: number,
  timestampServidor: number
): 'local' | 'servidor' {
  return timestampLocal > timestampServidor ? 'local' : 'servidor';
}

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
