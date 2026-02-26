import 'package:equatable/equatable.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object> get props => [];
}

// 1. Estado inicial (Pantalla de login normal)
class AuthInitial extends AuthState {}

// 2. Estado de carga (Muestra el circulito de "Cargando...")
class AuthLoading extends AuthState {}

// 3. Estado de éxito (Pasa a la pantalla principal)
class AuthAuthenticated extends AuthState {}

// 4. Estado de error (Muestra un mensaje rojo en pantalla)
class AuthError extends AuthState {
  final String mensaje;

  const AuthError(this.mensaje);

  @override
  List<Object> get props => [mensaje];
}

// Cuando el correo se envió con éxito (Paso 1 completado)
class AuthRecoveryCodeSent extends AuthState {
  final String email;
  const AuthRecoveryCodeSent(this.email);
  @override
  List<Object> get props => [email];
}

// Cuando el código de 6 dígitos es correcto (Paso 2 completado)
class AuthRecoveryCodeVerified extends AuthState {
  final String email;
  const AuthRecoveryCodeVerified(this.email);
  @override
  List<Object> get props => [email];
}

// Cuando la contraseña se cambió con éxito (Paso 3 completado)
class AuthRecoverySuccess extends AuthState {}