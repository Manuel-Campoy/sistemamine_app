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
      print('Error en login: $e');
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
}