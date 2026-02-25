abstract class IAuthRepository {
  Future<bool> login(String nombreUsuario, String contrasena);
  Future<bool> checkSesionActiva();
  Future<void> logout();
}