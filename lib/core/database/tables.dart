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