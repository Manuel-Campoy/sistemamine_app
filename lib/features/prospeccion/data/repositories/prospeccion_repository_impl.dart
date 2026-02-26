import 'package:injectable/injectable.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart';

import '../../../../core/database/database.dart';
import '../../domain/repositories/i_prospeccion_repository.dart';

@LazySingleton(as: IProspeccionRepository) // GetIt lo inyectará automáticamente
class ProspeccionRepositoryImpl implements IProspeccionRepository {
  final AppDatabase _db;
  final _uuid = const Uuid(); // Generador de UUIDs offline

  ProspeccionRepositoryImpl(this._db);

  @override
  Future<List<ProspeccionLote>> obtenerLotesActivos() async {
    // Es el equivalente a: SELECT * FROM ProspeccionLotes WHERE Activo = 1 ORDER BY FechaRegistro DESC
    return await (_db.select(_db.prospeccionLotes)
          ..where((t) => t.activo.equals(true))
          ..orderBy([(t) => OrderingTerm.desc(t.fechaRegistro)]))
        .get();
  }

  @override
  Future<String> registrarLote({
    required String idResponsable,
    required String nombreAlias,
    required String idEstatusProspeccion,
    double? leyEstimada,
    double? tonelajeEstimado,
    String? metodoMuestreo,
    String? observaciones,
  }) async {
    
    final nuevoIdLote = _uuid.v4(); // Generamos un ID único universal en la tablet

    // Usamos el objeto "Companion" para hacer INSERTS de forma segura
    final nuevoLote = ProspeccionLotesCompanion.insert(
      idLote: nuevoIdLote,
      idMina: 'MINA-DEFAULT-001', // Temporal hasta que hagamos el catálogo de minas
      idEstatusProspeccion: idEstatusProspeccion,
      idResponsable: idResponsable,
      nombreAlias: nombreAlias,
      fechaRegistro: DateTime.now(),
      
      // Los campos opcionales se envuelven en Value() para manejar nulos
      leyEstimada: Value(leyEstimada),
      tonelajeEstimado: Value(tonelajeEstimado),
      metodoMuestreo: Value(metodoMuestreo),
      observaciones: Value(observaciones),
      fechaCreacion: Value(DateTime.now()),
      fechaActualizacion: Value(DateTime.now()),
    );

    await _db.into(_db.prospeccionLotes).insert(nuevoLote);
    
    return nuevoIdLote;
  }
}