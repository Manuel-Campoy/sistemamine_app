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