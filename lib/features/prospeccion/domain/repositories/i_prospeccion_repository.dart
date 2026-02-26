import '../../../../core/database/database.dart';

abstract class IProspeccionRepository {
  /// Obtiene todos los lotes guardados en la tableta que estén activos
  Future<List<ProspeccionLote>> obtenerLotesActivos();
  
  /// Registra un nuevo lote en la base de datos local
  /// Retorna el [idLote] generado
  Future<String> registrarLote({
    required String idResponsable,
    required String nombreAlias,
    required String idEstatusProspeccion,
    double? leyEstimada,
    double? tonelajeEstimado,
    String? metodoMuestreo,
    String? observaciones,
  });
}