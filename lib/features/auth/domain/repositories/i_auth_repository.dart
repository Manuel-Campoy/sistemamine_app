abstract class IAuthRepository {
  Future<bool> login(String nombreUsuario, String contrasena);
  Future<bool> checkSesionActiva();
  Future<void> logout();

  /// Paso 1: Solicita enviar un código de 6 dígitos al correo
  Future<bool> solicitarCodigoRecuperacion(String correo);
  
  /// Paso 2: Valida que el código ingresado sea el correcto
  Future<bool> verificarCodigo(String correo, String codigo);
  
  /// Paso 3: Actualiza la contraseña en la base de datos
  Future<bool> cambiarContrasena(String correo, String nuevaContrasena);
}