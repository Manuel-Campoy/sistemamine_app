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