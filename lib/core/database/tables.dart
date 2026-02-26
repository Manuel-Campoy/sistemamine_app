import 'package:drift/drift.dart';

class Roles extends Table {
  TextColumn get idRol => text()(); 
  TextColumn get nombre => text().withLength(min: 1, max: 100)();
  TextColumn get descripcion => text().nullable().withLength(max: 255)();
  
  BoolColumn get activo => boolean().withDefault(const Constant(true))();
  DateTimeColumn get fechaCreacion => dateTime().nullable()();
  DateTimeColumn get fechaActualizacion => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {idRol};
}

class Usuarios extends Table {
  TextColumn get idUsuario => text()();
  TextColumn get idRol => text().references(Roles, #idRol)();

  TextColumn get nombres => text().withLength(min: 1, max: 100)();
  TextColumn get apellidoPaterno => text().withLength(min: 1, max: 100)();
  TextColumn get apellidoMaterno => text().withLength(min: 1, max: 100)();

  TextColumn get correoElectronico => text().withLength(min: 1, max: 150)();
  TextColumn get nombreUsuario => text().withLength(min: 1, max: 50)();
  TextColumn get contrasenaHash => text().withLength(min: 1, max: 255)();

  BoolColumn get activo => boolean().withDefault(const Constant(true))();
  DateTimeColumn get fechaCreacion => dateTime().nullable()();
  DateTimeColumn get fechaActualizacion => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {idUsuario};
}

class EstatusProspecciones extends Table {
  TextColumn get idEstatusProspeccion => text()();
  TextColumn get descripcion => text().withLength(min: 1, max: 100)();
  
  BoolColumn get activo => boolean().withDefault(const Constant(true))();

  @override
  Set<Column> get primaryKey => {idEstatusProspeccion};
}

class ProspeccionLotes extends Table {
  TextColumn get idLote => text()();
  
  TextColumn get idEstatusProspeccion => text().references(EstatusProspecciones, #idEstatusProspeccion)();
  TextColumn get idResponsable => text().references(Usuarios, #idUsuario)();
  
  TextColumn get idMina => text()(); 
  
  TextColumn get nombreAlias => text().withLength(min: 1, max: 150)();
  DateTimeColumn get fechaRegistro => dateTime()();
  DateTimeColumn get fechaMuestreo => dateTime().nullable()();
  
  TextColumn get metodoMuestreo => text().nullable().withLength(max: 100)();
  RealColumn get leyEstimada => real().nullable()();   // g/t
  RealColumn get tonelajeEstimado => real().nullable()(); // t
  TextColumn get observaciones => text().nullable()();
  
  // Control
  BoolColumn get activo => boolean().withDefault(const Constant(true))();
  DateTimeColumn get fechaCreacion => dateTime().nullable()();
  DateTimeColumn get fechaActualizacion => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {idLote};
}

class LoteCoordenadas extends Table {
  TextColumn get idCoordenada => text()();
  TextColumn get idLote => text().references(ProspeccionLotes, #idLote)();
  
  RealColumn get latitud => real()();
  RealColumn get longitud => real()();
  RealColumn get altitud => real().nullable()();
  RealColumn get precisionGPS => real().nullable()();
  IntColumn get ordenSecuencia => integer()();
  
  BoolColumn get activo => boolean().withDefault(const Constant(true))();
  DateTimeColumn get fechaCaptura => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {idCoordenada};
}