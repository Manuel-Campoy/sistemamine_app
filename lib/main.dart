import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sistemamine_app/core/di/injection.dart';
import 'package:get_it/get_it.dart';
import 'core/constants/app_colors.dart';
import 'core/router/app_router.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';

void main() async {
  // Asegura que los bindings de Flutter estén listos
  WidgetsFlutterBinding.ensureInitialized();
  
  configureDependencies(); 

  runApp(const SistemaMineApp());
}

class SistemaMineApp extends StatelessWidget {
  const SistemaMineApp({super.key});

  @override
  Widget build(BuildContext context) {
    // MultiBlocProvider inyecta los "cerebros" en el árbol de widgets
    return MultiBlocProvider(
      providers: [
        // Le pedimos a GetIt que nos dé la instancia del AuthBloc
        BlocProvider(create: (_) => GetIt.instance<AuthBloc>()),
      ],
      child: MaterialApp.router(
        title: 'SistemaMine',
        debugShowCheckedModeBanner: false, 
        theme: ThemeData(
          scaffoldBackgroundColor: AppColors.gray50,
          colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primaryBlue),
          useMaterial3: true,
        ),
        routerConfig: appRouter, 
      ),
    );
  }
}