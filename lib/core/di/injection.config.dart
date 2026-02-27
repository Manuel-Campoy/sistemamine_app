// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:dio/dio.dart' as _i361;
import 'package:flutter_secure_storage/flutter_secure_storage.dart' as _i558;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

import '../../features/auth/data/repositories/auth_repository_impl.dart'
    as _i153;
import '../../features/auth/domain/repositories/i_auth_repository.dart'
    as _i589;
import '../../features/auth/presentation/bloc/auth_bloc.dart' as _i797;
import '../../features/prospeccion/data/repositories/prospeccion_repository_impl.dart'
    as _i1044;
import '../../features/prospeccion/domain/repositories/i_prospeccion_repository.dart'
    as _i505;
import '../database/database.dart' as _i660;
import 'network_module.dart' as _i567;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final networkModule = _$NetworkModule();
    gh.lazySingleton<_i660.AppDatabase>(() => _i660.AppDatabase());
    gh.lazySingleton<_i361.Dio>(() => networkModule.dio);
    gh.lazySingleton<_i558.FlutterSecureStorage>(
      () => networkModule.secureStorage,
    );
    gh.lazySingleton<_i505.IProspeccionRepository>(
      () => _i1044.ProspeccionRepositoryImpl(gh<_i660.AppDatabase>()),
    );
    gh.lazySingleton<_i589.IAuthRepository>(
      () => _i153.AuthRepositoryImpl(
        gh<_i660.AppDatabase>(),
        gh<_i361.Dio>(),
        gh<_i558.FlutterSecureStorage>(),
      ),
    );
    gh.factory<_i797.AuthBloc>(
      () => _i797.AuthBloc(gh<_i589.IAuthRepository>()),
    );
    return this;
  }
}

class _$NetworkModule extends _i567.NetworkModule {}
