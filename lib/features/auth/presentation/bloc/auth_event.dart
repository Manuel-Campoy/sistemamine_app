import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object> get props => [];
}

// 1. Cuando la app abre, revisamos si ya había iniciado sesión antes
class CheckAuthStatus extends AuthEvent {}

// 2. Cuando el usuario presiona el botón "Entrar"
class LoginRequested extends AuthEvent {
  final String nombreUsuario;
  final String contrasena;

  const LoginRequested(this.nombreUsuario, this.contrasena);

  @override
  List<Object> get props => [nombreUsuario, contrasena];
}

// 3. Cuando el usuario presiona "Cerrar Sesión" en el menú
class LogoutRequested extends AuthEvent {}

class RecoverPasswordRequested extends AuthEvent {
  final String email;
  const RecoverPasswordRequested(this.email);
  @override
  List<Object> get props => [email];
}

class VerifyRecoveryCodeRequested extends AuthEvent {
  final String email;
  final String code;
  const VerifyRecoveryCodeRequested(this.email, this.code);
  @override
  List<Object> get props => [email, code];
}

class ResetPasswordRequested extends AuthEvent {
  final String email;
  final String newPassword;
  const ResetPasswordRequested(this.email, this.newPassword);
  @override
  List<Object> get props => [email, newPassword];
}