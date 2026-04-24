import Dexie, { type Table } from 'dexie';

// --- INTERFACES DE OPERACIÓN (Lectura/Escritura) ---
export interface MovimientoOffline {
    idmovimiento: string;
    idarealote: string;
    idresponsable: string;
    idvehiculo: string;
    turno: string;
    capacidadestimada: number | null;
    numeroextraccion: number;
    fechayhorainicio: string;
    fechayhorafin: string | null;
    cantidadextraida: number | null;
    destino: string;
    sincronizado: boolean; 
    intentoSync: number;
    timestamp_creacion: number;  // Timestamp de creación local
    timestamp_sincronizado?: number;  // Timestamp de última sincronización
    conflicto_detectado?: boolean;  // Flag para conflictos
}

export interface ProduccionOffline {
    idproduccion: string;
    idarealote: string;
    fechaproceso: string;
    toneladasprocesadas: number;
    cianurokg: number | null;
    onzasoro: number;
    onzasplata: number;
    observaciones: string;
    sincronizado: boolean;
    intentoSync: number;
    timestamp_creacion: number;  // Timestamp de creación local
    timestamp_sincronizado?: number;  // Timestamp de última sincronización
    conflicto_detectado?: boolean;  // Flag para conflictos
}

// --- INTERFACES DE CATÁLOGOS (Solo Lectura) ---
export interface VehiculoOffline {
    idvehiculo: string;
    numeroeconomico: string;
    marca: string;
}

export interface LoteOffline {
    idarealote: string;
    nombrealias: string;
    tonelajeestimado: number | null;
}

export interface UsuarioOffline {
    idusuario: string;
    nombre: string;
    rol: string;
}

export class SistemaMineDB extends Dexie {
    movimientos!: Table<MovimientoOffline>;
    vehiculos!: Table<VehiculoOffline>;
    lotes!: Table<LoteOffline>;
    usuarios!: Table<UsuarioOffline>;    
    produccion!: Table<ProduccionOffline>;    

    constructor() {
        super('SistemaMineDB');

        this.version(7).stores({
            movimientos: 'idmovimiento, idarealote, sincronizado, timestamp_creacion',
            produccion: 'idproduccion, idarealote, sincronizado, timestamp_creacion',
            vehiculos: 'idvehiculo',
            lotes: 'idarealote',
            usuarios: 'idusuario',
        });
    }
}

export const localDb = new SistemaMineDB();