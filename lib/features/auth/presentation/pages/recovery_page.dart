import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_colors.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../widgets/custom_text_field.dart';

class RecoveryPage extends StatefulWidget {
  const RecoveryPage({super.key});

  @override
  State<RecoveryPage> createState() => _RecoveryPageState();
}

class _RecoveryPageState extends State<RecoveryPage> {
  // Controladores de texto para los 3 pasos
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  final _formKey = GlobalKey<FormState>();
  
  // Controlamos en qué paso visual estamos (1: Correo, 2: Código, 3: Nueva Password, 4: Éxito)
  int _currentStep = 1; 
  String _savedEmail = ''; // Guardamos el correo para usarlo en los siguientes pasos

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        // Escuchamos los estados del BLoC para avanzar de paso visualmente
        if (state is AuthRecoveryCodeSent) {
          setState(() {
            _savedEmail = state.email;
            _currentStep = 2; // Avanzamos al código
          });
        } else if (state is AuthRecoveryCodeVerified) {
          setState(() => _currentStep = 3); // Avanzamos a la nueva contraseña
        } else if (state is AuthRecoverySuccess) {
          setState(() => _currentStep = 4); // Pantalla de éxito total
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
                    boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 30, offset: Offset(0, 15))],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Cabecera que cambia según el paso
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 24),
                        decoration: const BoxDecoration(
                          color: AppColors.primaryDark,
                          borderRadius: BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                        ),
                        child: Column(
                          children: [
                            Text(_currentStep == 4 ? '✅' : '🔐', style: const TextStyle(fontSize: 48)),
                            const SizedBox(height: 8),
                            Text(
                              _currentStep == 4 ? '¡Contraseña Actualizada!' : 'Recuperar Contraseña',
                              style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                            if (_currentStep < 4)
                              Text(
                                'Paso $_currentStep de 3',
                                style: const TextStyle(color: Colors.white70, fontSize: 14),
                              ),
                          ],
                        ),
                      ),

                      // Cuerpo del formulario
                      Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              // Alerta de error global
                              if (state is AuthError) ...[
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFEE2E2),
                                    border: Border.all(color: AppColors.dangerRed),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    children: [
                                      const Text('⚠️ '),
                                      Expanded(child: Text(state.mensaje, style: const TextStyle(color: Color(0xFF991B1B)))),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 20),
                              ],

                              // Renderizado condicional según el paso
                              if (_currentStep == 1) _buildStep1(isLoading),
                              if (_currentStep == 2) _buildStep2(isLoading),
                              if (_currentStep == 3) _buildStep3(isLoading),
                              if (_currentStep == 4) _buildStep4(context),
                            ],
                          ),
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

  // ==================== WIDGETS POR PASO ====================

  Widget _buildStep1(bool isLoading) {
    return Column(
      children: [
        const Text('Ingresa tu correo electrónico y te enviaremos un código de verificación.', textAlign: TextAlign.center),
        const SizedBox(height: 24),
        CustomTextField(
          label: 'Correo Electrónico',
          hint: 'usuario@ejemplo.com',
          prefixIcon: Icons.email_outlined,
          controller: _emailController,
          enabled: !isLoading,
          validator: (val) => (val == null || !val.contains('@')) ? 'Ingresa un correo válido' : null,
        ),
        const SizedBox(height: 32),
        _buildPrimaryButton(
          text: 'ENVIAR CÓDIGO 📨',
          isLoading: isLoading,
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              context.read<AuthBloc>().add(RecoverPasswordRequested(_emailController.text.trim()));
            }
          },
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: isLoading ? null : () => context.pop(), // Volver al login
          child: const Text('← Volver al Login', style: TextStyle(color: AppColors.gray700)),
        )
      ],
    );
  }

  Widget _buildStep2(bool isLoading) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0xFFD1FAE5), border: Border.all(color: AppColors.successGreen), borderRadius: BorderRadius.circular(12)),
          child: Text('✓ Código enviado a $_savedEmail', style: const TextStyle(color: Color(0xFF065F46))),
        ),
        const SizedBox(height: 24),
        CustomTextField(
          label: 'Código de Verificación (6 dígitos)',
          hint: '123456',
          prefixIcon: Icons.numbers,
          controller: _codeController,
          enabled: !isLoading,
          validator: (val) => (val == null || val.length != 6) ? 'El código debe tener 6 dígitos' : null,
        ),
        const SizedBox(height: 32),
        _buildPrimaryButton(
          text: 'VERIFICAR CÓDIGO →',
          isLoading: isLoading,
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              context.read<AuthBloc>().add(VerifyRecoveryCodeRequested(_savedEmail, _codeController.text.trim()));
            }
          },
        ),
      ],
    );
  }

  Widget _buildStep3(bool isLoading) {
    return Column(
      children: [
        CustomTextField(
          label: 'Nueva Contraseña',
          hint: '••••••••',
          prefixIcon: Icons.lock_outline,
          isPassword: true,
          controller: _newPasswordController,
          enabled: !isLoading,
          validator: (val) => (val == null || val.length < 6) ? 'Debe tener al menos 6 caracteres' : null,
        ),
        const SizedBox(height: 20),
        CustomTextField(
          label: 'Confirmar Contraseña',
          hint: '••••••••',
          prefixIcon: Icons.lock_outline,
          isPassword: true,
          controller: _confirmPasswordController,
          enabled: !isLoading,
          validator: (val) {
            if (val != _newPasswordController.text) return 'Las contraseñas no coinciden';
            return null;
          },
        ),
        const SizedBox(height: 32),
        _buildPrimaryButton(
          text: 'GUARDAR CONTRASEÑA ✓',
          isLoading: isLoading,
          color: AppColors.successGreen,
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              context.read<AuthBloc>().add(ResetPasswordRequested(_savedEmail, _newPasswordController.text.trim()));
            }
          },
        ),
      ],
    );
  }

  Widget _buildStep4(BuildContext context) {
    return Column(
      children: [
        const Text('Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.', textAlign: TextAlign.center),
        const SizedBox(height: 32),
        _buildPrimaryButton(
          text: 'IR AL LOGIN →',
          isLoading: false,
          onPressed: () {
            // Limpiamos el estado del BLoC y regresamos al login
            context.read<AuthBloc>().add(CheckAuthStatus()); 
            context.pop(); 
          },
        ),
      ],
    );
  }

  // Widget de botón reutilizable
  Widget _buildPrimaryButton({required String text, required bool isLoading, required VoidCallback onPressed, Color color = AppColors.primaryBlue}) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: isLoading
            ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3))
            : Text(text, style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
      ),
    );
  }
}