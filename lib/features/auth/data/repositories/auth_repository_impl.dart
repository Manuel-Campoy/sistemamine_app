import 'package:dio/dio.dart';
import 'package:drift/drift.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/database/database.dart';
import '../../domain/repositories/i_auth_repository.dart';

@LazySingleton(as: IAuthRepository)
class AuthRepositoryImpl implements IAuthRepository {
  final AppDatabase _localDb;
  final Dio _dio;
  final FlutterSecureStorage _secureStorage;

  // GetIt inyecta ahora 3 cosas: Drift, Dio y SecureStorage
  AuthRepositoryImpl(this._localDb, this._dio, this._secureStorage);

  @override
  Future<bool> login(String nombreUsuario, String contrasena) async {
    try {
      // 1. Hacemos la petición POST a tu API real
      final response = await _dio.post(
        '/auth/login', // La ruta de tu backend
        data: {
          'usuario': nombreUsuario,
          'password': contrasena,
        },
      );

      // 2. Si el backend responde 200 OK, extraemos los datos
      if (response.statusCode == 200) {
        final data = response.data;
        
        // Asumiendo que tu API devuelve un JSON como: { "token": "ey...", "usuario": { "id": "...", "nombres": "..." } }
        final token = data['token'];
        final userData = data['usuario'];

        // 3. Guardamos el Token de forma ultra segura
        await _secureStorage.write(key: 'jwt_token', value: token);

        // 4. Sincronizamos los datos del usuario en la base local (Drift)
        final usuarioSincronizado = UsuariosCompanion.insert(
          idUsuario: userData['idUsuario'],
          idRol: userData['idRol'], 
          nombres: userData['nombres'],
          apellidoPaterno: userData['apellidoPaterno'],
          apellidoMaterno: userData['apellidoMaterno'],
          correoElectronico: userData['correoElectronico'],
          nombreUsuario: nombreUsuario,
          contrasenaHash: 'ENCRIPTADO_EN_BACKEND', // No guardamos la password real aquí
        );

        await _localDb.into(_localDb.usuarios).insertOnConflictUpdate(usuarioSincronizado);
        
        return true;
      }
      return false;
    } on DioException catch (e) {
      // Manejo de errores de red o credenciales incorrectas (ej. 401 Unauthorized)
      if (e.response?.statusCode == 401) {
        throw Exception('Credenciales incorrectas');
      }
      throw Exception('Error de conexión con el servidor');
    } catch (e) {
      throw Exception('Error inesperado: $e');
    }
  }

  @override
  Future<bool> checkSesionActiva() async {
    // Verificamos si existe el token guardado
    final token = await _secureStorage.read(key: 'jwt_token');
    if (token == null) return false;

    // Verificamos si hay un usuario en Drift
    final query = _localDb.select(_localDb.usuarios)..limit(1);
    final usuarios = await query.get();
    
    return usuarios.isNotEmpty;
  }

  @override
  Future<void> logout() async {
    // 1. Borramos el token de seguridad
    await _secureStorage.delete(key: 'jwt_token');
    // 2. Borramos los datos locales del usuario
    await _localDb.delete(_localDb.usuarios).go();
  }

  // ================= MÉTODOS DE RECUPERACIÓN =================
  @override
  Future<bool> solicitarCodigoRecuperacion(String correo) async {
    try {
      final response = await _dio.post('/auth/recuperar', data: {'correo': correo});
      return response.statusCode == 200;
    } catch (_) { return false; }
  }

  @override
  Future<bool> verificarCodigo(String correo, String codigo) async {
    try {
      final response = await _dio.post('/auth/verificar-codigo', data: {'correo': correo, 'codigo': codigo});
      return response.statusCode == 200;
    } catch (_) { return false; }
  }

  @override
  Future<bool> cambiarContrasena(String correo, String nuevaContrasena) async {
    try {
      final response = await _dio.post('/auth/cambiar-password', data: {'correo': correo, 'nuevaPassword': nuevaContrasena});
      return response.statusCode == 200;
    } catch (_) { return false; }
  }
}