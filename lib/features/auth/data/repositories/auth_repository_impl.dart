import 'package:injectable/injectable.dart';
import 'package:drift/drift.dart';

// Importamos la BD que creamos en core y el contrato de domain
import '../../../../core/database/database.dart';
import '../../domain/repositories/i_auth_repository.dart';

@LazySingleton(as: IAuthRepository) 
class AuthRepositoryImpl implements IAuthRepository {
  final AppDatabase _localDb;

  // Injectable inyectará automáticamente AppDatabase aquí
  AuthRepositoryImpl(this._localDb);

  @override
  Future<bool> login(String nombreUsuario, String contrasena) async {
    try {
      // 1. Aquí haríamos la petición a tu API (SQL Server) con Dio.
      // 2. Si hay internet y el login es correcto, el servidor devuelve los datos del usuario.
      
      // Simulamos que la API nos respondió que sí y nos dio un usuario:
      final mockUsuarioDesdeApi = UsuariosCompanion.insert(
        idUsuario: 'UUID-1234-5678',
        idRol: 'UUID-ROL-CHOFER', // Asumiendo que este rol ya existe localmente
        nombres: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        correoElectronico: 'juan@mina.com',
        nombreUsuario: nombreUsuario,
        contrasenaHash: 'hash_simulado',
      );

      // 3. Guardamos/Actualizamos al usuario en la BD local (Drift) para el modo offline
      await _localDb.into(_localDb.usuarios).insertOnConflictUpdate(mockUsuarioDesdeApi);
      
      return true; // Login exitoso
    } catch (e) {
      return false; // Falló el login
    }
  }

  @override
  Future<bool> checkSesionActiva() async {
    // Busca si hay al menos un usuario activo en la tabla local
    final query = _localDb.select(_localDb.usuarios)..limit(1);
    final usuariosGuardados = await query.get();
    
    return usuariosGuardados.isNotEmpty;
  }

  @override
  Future<void> logout() async {
    // Borramos la tabla de usuarios locales al cerrar sesión
    await _localDb.delete(_localDb.usuarios).go();
  }

  @override
  Future<bool> solicitarCodigoRecuperacion(String correo) async {
    // Aquí enviarías la petición a tu API para mandar el email
    await Future.delayed(const Duration(seconds: 2)); // Simulamos carga
    
    // Verificamos si el usuario existe localmente (o en la API)
    final query = _localDb.select(_localDb.usuarios)
      ..where((t) => t.correoElectronico.equals(correo));
    final usuario = await query.getSingleOrNull();
    
    // Retorna true si simulamos que el correo se envió
    return usuario != null || correo == 'juan.perez@minera.com'; 
  }

  @override
  Future<bool> verificarCodigo(String correo, String codigo) async {
    await Future.delayed(const Duration(seconds: 1));
    // Simulamos que el código correcto siempre es '123456' para pruebas
    return codigo == '123456'; 
  }

  @override
  Future<bool> cambiarContrasena(String correo, String nuevaContrasena) async {
    await Future.delayed(const Duration(seconds: 2));
    // Aquí harías el UPDATE en tu SQL Server y luego en la BD local
    return true; 
  }
}