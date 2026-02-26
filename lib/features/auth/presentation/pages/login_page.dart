import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../widgets/custom_text_field.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _usuarioController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _usuarioController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _ejecutarLogin() {
    // Disparamos el evento hacia el BLoC
    context.read<AuthBloc>().add(
          LoginRequested(
            _usuarioController.text.trim(),
            _passwordController.text.trim(),
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    // BlocConsumer escucha los cambios de estado para reaccionar
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthAuthenticated) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('¡Bienvenido al Sistema Minero!'), backgroundColor: AppColors.successGreen),
          );
          context.go('/dashboard');
        }
      },
      builder: (context, state) {
        final isLoading = state is AuthLoading;

        return Scaffold(
          body: Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.primaryDark, Color(0xFF2D3748), AppColors.primaryDark],
              ),
            ),
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 450),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: const [
                      BoxShadow(color: Colors.black45, blurRadius: 30, offset: Offset(0, 15)),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Tarjeta Cabecera (Oscura)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
                        decoration: const BoxDecoration(
                          color: AppColors.primaryDark,
                          borderRadius: BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                        ),
                        child: const Column(
                          children: [
                            Text('⛏️', style: TextStyle(fontSize: 48)),
                            SizedBox(height: 8),
                            Text('SistemaMine', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                            Text('Sistema de Gestión Minera', style: TextStyle(color: Colors.white70, fontSize: 14)),
                          ],
                        ),
                      ),
                      
                      // Cuerpo del Formulario
                      Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          children: [
                            // Alerta de Error 
                            if (state is AuthError)
                              Container(
                                padding: const EdgeInsets.all(12),
                                margin: const EdgeInsets.only(bottom: 24),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFEE2E2),
                                  border: Border.all(color: AppColors.dangerRed),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    const Text('⚠️ ', style: TextStyle(fontSize: 20)),
                                    Expanded(
                                      child: Text(state.mensaje, style: const TextStyle(color: Color(0xFF991B1B), fontSize: 14)),
                                    ),
                                  ],
                                ),
                              ),

                            CustomTextField(
                              label: 'Usuario o Correo',
                              hint: 'usuario@ejemplo.com',
                              prefixIcon: Icons.person_outline,
                              controller: _usuarioController,
                              enabled: !isLoading,
                            ),
                            const SizedBox(height: 24),
                            CustomTextField(
                              label: 'Contraseña',
                              hint: '••••••••',
                              prefixIcon: Icons.lock_outline,
                              isPassword: true,
                              controller: _passwordController,
                              enabled: !isLoading,
                            ),
                            const SizedBox(height: 32),
                            
                            // Botón Dinámico
                            SizedBox(
                              width: double.infinity,
                              height: 56,
                              child: ElevatedButton(
                                onPressed: isLoading ? null : _ejecutarLogin,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primaryBlue,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  elevation: 4,
                                ),
                                child: isLoading
                                    ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3))
                                    : const Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text('INICIAR SESIÓN', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
                                          SizedBox(width: 8),
                                          Icon(Icons.arrow_forward),
                                        ],
                                      ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}