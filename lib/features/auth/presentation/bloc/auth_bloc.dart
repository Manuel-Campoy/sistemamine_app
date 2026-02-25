// lib/features/auth/presentation/bloc/auth_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/repositories/i_auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

@injectable // ¡Le decimos a GetIt que prepare este BLoC!
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final IAuthRepository _authRepository;

  // GetIt inyectará el repositorio automáticamente aquí
  AuthBloc(this._authRepository) : super(AuthInitial()) {
    
    // Registramos qué hacer con cada evento
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onCheckAuthStatus(CheckAuthStatus event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      final tieneSesion = await _authRepository.checkSesionActiva();
      if (tieneSesion) {
        emit(AuthAuthenticated());
      } else {
        emit(AuthInitial());
      }
    } catch (e) {
      emit(const AuthError('Error al verificar la sesión local'));
    }
  }

  Future<void> _onLoginRequested(LoginRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading()); // Muestra el "Cargando..." en pantalla
    try {
      final exito = await _authRepository.login(event.nombreUsuario, event.contrasena);
      
      if (exito) {
        emit(AuthAuthenticated()); // ¡Navega al menú principal!
      } else {
        emit(const AuthError('Usuario o contraseña incorrectos')); // Muestra error
      }
    } catch (e) {
      emit(AuthError('Error de sistema: $e'));
    }
  }

  Future<void> _onLogoutRequested(LogoutRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await _authRepository.logout();
    emit(AuthInitial()); // Lo regresa a la pantalla de Login
  }
}