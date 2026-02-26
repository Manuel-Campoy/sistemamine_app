import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'SistemaMine - Panel Principal', 
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppColors.primaryDark,
        actions: [
          // Botón para cerrar sesión
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: 'Cerrar Sesión',
            onPressed: () {
              // 1. Le decimos al cerebro que borre la sesión
              context.read<AuthBloc>().add(LogoutRequested());
              // 2. Lo regresamos a la pantalla de Login
              context.go('/login');
            },
          )
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '👷‍♂️',
              style: TextStyle(fontSize: 80),
            ),
            const SizedBox(height: 16),
            const Text(
              '¡Bienvenido al Dashboard!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.gray700),
            ),
            const SizedBox(height: 8),
            Text(
              'Aquí irán los módulos de Prospección, Movimiento y Planta.',
              style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}