import 'package:flutter/material.dart';
import 'package:sistemamine_app/core/di/injection.dart'; // Ruta de inyección

void main() {
  // Asegura que los bindings de Flutter estén listos antes de arrancar
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inyección de dependencias
  configureDependencies(); 

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SistemaMine',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.amber), 
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text('SistemaMine - Infraestructura lista'),
        ),
      ),
    );
  }
}