// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $RolesTable extends Roles with TableInfo<$RolesTable, Role> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $RolesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idRolMeta = const VerificationMeta('idRol');
  @override
  late final GeneratedColumn<String> idRol = GeneratedColumn<String>(
    'id_rol',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nombreMeta = const VerificationMeta('nombre');
  @override
  late final GeneratedColumn<String> nombre = GeneratedColumn<String>(
    'nombre',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 100,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _descripcionMeta = const VerificationMeta(
    'descripcion',
  );
  @override
  late final GeneratedColumn<String> descripcion = GeneratedColumn<String>(
    'descripcion',
    aliasedName,
    true,
    additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 255),
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _activoMeta = const VerificationMeta('activo');
  @override
  late final GeneratedColumn<bool> activo = GeneratedColumn<bool>(
    'activo',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("activo" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _fechaCreacionMeta = const VerificationMeta(
    'fechaCreacion',
  );
  @override
  late final GeneratedColumn<DateTime> fechaCreacion =
      GeneratedColumn<DateTime>(
        'fecha_creacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _fechaActualizacionMeta =
      const VerificationMeta('fechaActualizacion');
  @override
  late final GeneratedColumn<DateTime> fechaActualizacion =
      GeneratedColumn<DateTime>(
        'fecha_actualizacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  @override
  List<GeneratedColumn> get $columns => [
    idRol,
    nombre,
    descripcion,
    activo,
    fechaCreacion,
    fechaActualizacion,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'roles';
  @override
  VerificationContext validateIntegrity(
    Insertable<Role> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id_rol')) {
      context.handle(
        _idRolMeta,
        idRol.isAcceptableOrUnknown(data['id_rol']!, _idRolMeta),
      );
    } else if (isInserting) {
      context.missing(_idRolMeta);
    }
    if (data.containsKey('nombre')) {
      context.handle(
        _nombreMeta,
        nombre.isAcceptableOrUnknown(data['nombre']!, _nombreMeta),
      );
    } else if (isInserting) {
      context.missing(_nombreMeta);
    }
    if (data.containsKey('descripcion')) {
      context.handle(
        _descripcionMeta,
        descripcion.isAcceptableOrUnknown(
          data['descripcion']!,
          _descripcionMeta,
        ),
      );
    }
    if (data.containsKey('activo')) {
      context.handle(
        _activoMeta,
        activo.isAcceptableOrUnknown(data['activo']!, _activoMeta),
      );
    }
    if (data.containsKey('fecha_creacion')) {
      context.handle(
        _fechaCreacionMeta,
        fechaCreacion.isAcceptableOrUnknown(
          data['fecha_creacion']!,
          _fechaCreacionMeta,
        ),
      );
    }
    if (data.containsKey('fecha_actualizacion')) {
      context.handle(
        _fechaActualizacionMeta,
        fechaActualizacion.isAcceptableOrUnknown(
          data['fecha_actualizacion']!,
          _fechaActualizacionMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {idRol};
  @override
  Role map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Role(
      idRol: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_rol'],
      )!,
      nombre: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nombre'],
      )!,
      descripcion: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}descripcion'],
      ),
      activo: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}activo'],
      )!,
      fechaCreacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_creacion'],
      ),
      fechaActualizacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_actualizacion'],
      ),
    );
  }

  @override
  $RolesTable createAlias(String alias) {
    return $RolesTable(attachedDatabase, alias);
  }
}

class Role extends DataClass implements Insertable<Role> {
  final String idRol;
  final String nombre;
  final String? descripcion;
  final bool activo;
  final DateTime? fechaCreacion;
  final DateTime? fechaActualizacion;
  const Role({
    required this.idRol,
    required this.nombre,
    this.descripcion,
    required this.activo,
    this.fechaCreacion,
    this.fechaActualizacion,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id_rol'] = Variable<String>(idRol);
    map['nombre'] = Variable<String>(nombre);
    if (!nullToAbsent || descripcion != null) {
      map['descripcion'] = Variable<String>(descripcion);
    }
    map['activo'] = Variable<bool>(activo);
    if (!nullToAbsent || fechaCreacion != null) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion);
    }
    if (!nullToAbsent || fechaActualizacion != null) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion);
    }
    return map;
  }

  RolesCompanion toCompanion(bool nullToAbsent) {
    return RolesCompanion(
      idRol: Value(idRol),
      nombre: Value(nombre),
      descripcion: descripcion == null && nullToAbsent
          ? const Value.absent()
          : Value(descripcion),
      activo: Value(activo),
      fechaCreacion: fechaCreacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaCreacion),
      fechaActualizacion: fechaActualizacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaActualizacion),
    );
  }

  factory Role.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Role(
      idRol: serializer.fromJson<String>(json['idRol']),
      nombre: serializer.fromJson<String>(json['nombre']),
      descripcion: serializer.fromJson<String?>(json['descripcion']),
      activo: serializer.fromJson<bool>(json['activo']),
      fechaCreacion: serializer.fromJson<DateTime?>(json['fechaCreacion']),
      fechaActualizacion: serializer.fromJson<DateTime?>(
        json['fechaActualizacion'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'idRol': serializer.toJson<String>(idRol),
      'nombre': serializer.toJson<String>(nombre),
      'descripcion': serializer.toJson<String?>(descripcion),
      'activo': serializer.toJson<bool>(activo),
      'fechaCreacion': serializer.toJson<DateTime?>(fechaCreacion),
      'fechaActualizacion': serializer.toJson<DateTime?>(fechaActualizacion),
    };
  }

  Role copyWith({
    String? idRol,
    String? nombre,
    Value<String?> descripcion = const Value.absent(),
    bool? activo,
    Value<DateTime?> fechaCreacion = const Value.absent(),
    Value<DateTime?> fechaActualizacion = const Value.absent(),
  }) => Role(
    idRol: idRol ?? this.idRol,
    nombre: nombre ?? this.nombre,
    descripcion: descripcion.present ? descripcion.value : this.descripcion,
    activo: activo ?? this.activo,
    fechaCreacion: fechaCreacion.present
        ? fechaCreacion.value
        : this.fechaCreacion,
    fechaActualizacion: fechaActualizacion.present
        ? fechaActualizacion.value
        : this.fechaActualizacion,
  );
  Role copyWithCompanion(RolesCompanion data) {
    return Role(
      idRol: data.idRol.present ? data.idRol.value : this.idRol,
      nombre: data.nombre.present ? data.nombre.value : this.nombre,
      descripcion: data.descripcion.present
          ? data.descripcion.value
          : this.descripcion,
      activo: data.activo.present ? data.activo.value : this.activo,
      fechaCreacion: data.fechaCreacion.present
          ? data.fechaCreacion.value
          : this.fechaCreacion,
      fechaActualizacion: data.fechaActualizacion.present
          ? data.fechaActualizacion.value
          : this.fechaActualizacion,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Role(')
          ..write('idRol: $idRol, ')
          ..write('nombre: $nombre, ')
          ..write('descripcion: $descripcion, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    idRol,
    nombre,
    descripcion,
    activo,
    fechaCreacion,
    fechaActualizacion,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Role &&
          other.idRol == this.idRol &&
          other.nombre == this.nombre &&
          other.descripcion == this.descripcion &&
          other.activo == this.activo &&
          other.fechaCreacion == this.fechaCreacion &&
          other.fechaActualizacion == this.fechaActualizacion);
}

class RolesCompanion extends UpdateCompanion<Role> {
  final Value<String> idRol;
  final Value<String> nombre;
  final Value<String?> descripcion;
  final Value<bool> activo;
  final Value<DateTime?> fechaCreacion;
  final Value<DateTime?> fechaActualizacion;
  final Value<int> rowid;
  const RolesCompanion({
    this.idRol = const Value.absent(),
    this.nombre = const Value.absent(),
    this.descripcion = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  RolesCompanion.insert({
    required String idRol,
    required String nombre,
    this.descripcion = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : idRol = Value(idRol),
       nombre = Value(nombre);
  static Insertable<Role> custom({
    Expression<String>? idRol,
    Expression<String>? nombre,
    Expression<String>? descripcion,
    Expression<bool>? activo,
    Expression<DateTime>? fechaCreacion,
    Expression<DateTime>? fechaActualizacion,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (idRol != null) 'id_rol': idRol,
      if (nombre != null) 'nombre': nombre,
      if (descripcion != null) 'descripcion': descripcion,
      if (activo != null) 'activo': activo,
      if (fechaCreacion != null) 'fecha_creacion': fechaCreacion,
      if (fechaActualizacion != null) 'fecha_actualizacion': fechaActualizacion,
      if (rowid != null) 'rowid': rowid,
    });
  }

  RolesCompanion copyWith({
    Value<String>? idRol,
    Value<String>? nombre,
    Value<String?>? descripcion,
    Value<bool>? activo,
    Value<DateTime?>? fechaCreacion,
    Value<DateTime?>? fechaActualizacion,
    Value<int>? rowid,
  }) {
    return RolesCompanion(
      idRol: idRol ?? this.idRol,
      nombre: nombre ?? this.nombre,
      descripcion: descripcion ?? this.descripcion,
      activo: activo ?? this.activo,
      fechaCreacion: fechaCreacion ?? this.fechaCreacion,
      fechaActualizacion: fechaActualizacion ?? this.fechaActualizacion,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (idRol.present) {
      map['id_rol'] = Variable<String>(idRol.value);
    }
    if (nombre.present) {
      map['nombre'] = Variable<String>(nombre.value);
    }
    if (descripcion.present) {
      map['descripcion'] = Variable<String>(descripcion.value);
    }
    if (activo.present) {
      map['activo'] = Variable<bool>(activo.value);
    }
    if (fechaCreacion.present) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion.value);
    }
    if (fechaActualizacion.present) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('RolesCompanion(')
          ..write('idRol: $idRol, ')
          ..write('nombre: $nombre, ')
          ..write('descripcion: $descripcion, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $UsuariosTable extends Usuarios with TableInfo<$UsuariosTable, Usuario> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UsuariosTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idUsuarioMeta = const VerificationMeta(
    'idUsuario',
  );
  @override
  late final GeneratedColumn<String> idUsuario = GeneratedColumn<String>(
    'id_usuario',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _idRolMeta = const VerificationMeta('idRol');
  @override
  late final GeneratedColumn<String> idRol = GeneratedColumn<String>(
    'id_rol',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES roles (id_rol)',
    ),
  );
  static const VerificationMeta _nombresMeta = const VerificationMeta(
    'nombres',
  );
  @override
  late final GeneratedColumn<String> nombres = GeneratedColumn<String>(
    'nombres',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 100,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _apellidoPaternoMeta = const VerificationMeta(
    'apellidoPaterno',
  );
  @override
  late final GeneratedColumn<String> apellidoPaterno = GeneratedColumn<String>(
    'apellido_paterno',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 100,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _apellidoMaternoMeta = const VerificationMeta(
    'apellidoMaterno',
  );
  @override
  late final GeneratedColumn<String> apellidoMaterno = GeneratedColumn<String>(
    'apellido_materno',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 100,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _correoElectronicoMeta = const VerificationMeta(
    'correoElectronico',
  );
  @override
  late final GeneratedColumn<String> correoElectronico =
      GeneratedColumn<String>(
        'correo_electronico',
        aliasedName,
        false,
        additionalChecks: GeneratedColumn.checkTextLength(
          minTextLength: 1,
          maxTextLength: 150,
        ),
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _nombreUsuarioMeta = const VerificationMeta(
    'nombreUsuario',
  );
  @override
  late final GeneratedColumn<String> nombreUsuario = GeneratedColumn<String>(
    'nombre_usuario',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 50,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _contrasenaHashMeta = const VerificationMeta(
    'contrasenaHash',
  );
  @override
  late final GeneratedColumn<String> contrasenaHash = GeneratedColumn<String>(
    'contrasena_hash',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 255,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _activoMeta = const VerificationMeta('activo');
  @override
  late final GeneratedColumn<bool> activo = GeneratedColumn<bool>(
    'activo',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("activo" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _fechaCreacionMeta = const VerificationMeta(
    'fechaCreacion',
  );
  @override
  late final GeneratedColumn<DateTime> fechaCreacion =
      GeneratedColumn<DateTime>(
        'fecha_creacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _fechaActualizacionMeta =
      const VerificationMeta('fechaActualizacion');
  @override
  late final GeneratedColumn<DateTime> fechaActualizacion =
      GeneratedColumn<DateTime>(
        'fecha_actualizacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  @override
  List<GeneratedColumn> get $columns => [
    idUsuario,
    idRol,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    correoElectronico,
    nombreUsuario,
    contrasenaHash,
    activo,
    fechaCreacion,
    fechaActualizacion,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'usuarios';
  @override
  VerificationContext validateIntegrity(
    Insertable<Usuario> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id_usuario')) {
      context.handle(
        _idUsuarioMeta,
        idUsuario.isAcceptableOrUnknown(data['id_usuario']!, _idUsuarioMeta),
      );
    } else if (isInserting) {
      context.missing(_idUsuarioMeta);
    }
    if (data.containsKey('id_rol')) {
      context.handle(
        _idRolMeta,
        idRol.isAcceptableOrUnknown(data['id_rol']!, _idRolMeta),
      );
    } else if (isInserting) {
      context.missing(_idRolMeta);
    }
    if (data.containsKey('nombres')) {
      context.handle(
        _nombresMeta,
        nombres.isAcceptableOrUnknown(data['nombres']!, _nombresMeta),
      );
    } else if (isInserting) {
      context.missing(_nombresMeta);
    }
    if (data.containsKey('apellido_paterno')) {
      context.handle(
        _apellidoPaternoMeta,
        apellidoPaterno.isAcceptableOrUnknown(
          data['apellido_paterno']!,
          _apellidoPaternoMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_apellidoPaternoMeta);
    }
    if (data.containsKey('apellido_materno')) {
      context.handle(
        _apellidoMaternoMeta,
        apellidoMaterno.isAcceptableOrUnknown(
          data['apellido_materno']!,
          _apellidoMaternoMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_apellidoMaternoMeta);
    }
    if (data.containsKey('correo_electronico')) {
      context.handle(
        _correoElectronicoMeta,
        correoElectronico.isAcceptableOrUnknown(
          data['correo_electronico']!,
          _correoElectronicoMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_correoElectronicoMeta);
    }
    if (data.containsKey('nombre_usuario')) {
      context.handle(
        _nombreUsuarioMeta,
        nombreUsuario.isAcceptableOrUnknown(
          data['nombre_usuario']!,
          _nombreUsuarioMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_nombreUsuarioMeta);
    }
    if (data.containsKey('contrasena_hash')) {
      context.handle(
        _contrasenaHashMeta,
        contrasenaHash.isAcceptableOrUnknown(
          data['contrasena_hash']!,
          _contrasenaHashMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_contrasenaHashMeta);
    }
    if (data.containsKey('activo')) {
      context.handle(
        _activoMeta,
        activo.isAcceptableOrUnknown(data['activo']!, _activoMeta),
      );
    }
    if (data.containsKey('fecha_creacion')) {
      context.handle(
        _fechaCreacionMeta,
        fechaCreacion.isAcceptableOrUnknown(
          data['fecha_creacion']!,
          _fechaCreacionMeta,
        ),
      );
    }
    if (data.containsKey('fecha_actualizacion')) {
      context.handle(
        _fechaActualizacionMeta,
        fechaActualizacion.isAcceptableOrUnknown(
          data['fecha_actualizacion']!,
          _fechaActualizacionMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {idUsuario};
  @override
  Usuario map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Usuario(
      idUsuario: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_usuario'],
      )!,
      idRol: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_rol'],
      )!,
      nombres: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nombres'],
      )!,
      apellidoPaterno: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}apellido_paterno'],
      )!,
      apellidoMaterno: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}apellido_materno'],
      )!,
      correoElectronico: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}correo_electronico'],
      )!,
      nombreUsuario: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nombre_usuario'],
      )!,
      contrasenaHash: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}contrasena_hash'],
      )!,
      activo: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}activo'],
      )!,
      fechaCreacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_creacion'],
      ),
      fechaActualizacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_actualizacion'],
      ),
    );
  }

  @override
  $UsuariosTable createAlias(String alias) {
    return $UsuariosTable(attachedDatabase, alias);
  }
}

class Usuario extends DataClass implements Insertable<Usuario> {
  final String idUsuario;
  final String idRol;
  final String nombres;
  final String apellidoPaterno;
  final String apellidoMaterno;
  final String correoElectronico;
  final String nombreUsuario;
  final String contrasenaHash;
  final bool activo;
  final DateTime? fechaCreacion;
  final DateTime? fechaActualizacion;
  const Usuario({
    required this.idUsuario,
    required this.idRol,
    required this.nombres,
    required this.apellidoPaterno,
    required this.apellidoMaterno,
    required this.correoElectronico,
    required this.nombreUsuario,
    required this.contrasenaHash,
    required this.activo,
    this.fechaCreacion,
    this.fechaActualizacion,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id_usuario'] = Variable<String>(idUsuario);
    map['id_rol'] = Variable<String>(idRol);
    map['nombres'] = Variable<String>(nombres);
    map['apellido_paterno'] = Variable<String>(apellidoPaterno);
    map['apellido_materno'] = Variable<String>(apellidoMaterno);
    map['correo_electronico'] = Variable<String>(correoElectronico);
    map['nombre_usuario'] = Variable<String>(nombreUsuario);
    map['contrasena_hash'] = Variable<String>(contrasenaHash);
    map['activo'] = Variable<bool>(activo);
    if (!nullToAbsent || fechaCreacion != null) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion);
    }
    if (!nullToAbsent || fechaActualizacion != null) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion);
    }
    return map;
  }

  UsuariosCompanion toCompanion(bool nullToAbsent) {
    return UsuariosCompanion(
      idUsuario: Value(idUsuario),
      idRol: Value(idRol),
      nombres: Value(nombres),
      apellidoPaterno: Value(apellidoPaterno),
      apellidoMaterno: Value(apellidoMaterno),
      correoElectronico: Value(correoElectronico),
      nombreUsuario: Value(nombreUsuario),
      contrasenaHash: Value(contrasenaHash),
      activo: Value(activo),
      fechaCreacion: fechaCreacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaCreacion),
      fechaActualizacion: fechaActualizacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaActualizacion),
    );
  }

  factory Usuario.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Usuario(
      idUsuario: serializer.fromJson<String>(json['idUsuario']),
      idRol: serializer.fromJson<String>(json['idRol']),
      nombres: serializer.fromJson<String>(json['nombres']),
      apellidoPaterno: serializer.fromJson<String>(json['apellidoPaterno']),
      apellidoMaterno: serializer.fromJson<String>(json['apellidoMaterno']),
      correoElectronico: serializer.fromJson<String>(json['correoElectronico']),
      nombreUsuario: serializer.fromJson<String>(json['nombreUsuario']),
      contrasenaHash: serializer.fromJson<String>(json['contrasenaHash']),
      activo: serializer.fromJson<bool>(json['activo']),
      fechaCreacion: serializer.fromJson<DateTime?>(json['fechaCreacion']),
      fechaActualizacion: serializer.fromJson<DateTime?>(
        json['fechaActualizacion'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'idUsuario': serializer.toJson<String>(idUsuario),
      'idRol': serializer.toJson<String>(idRol),
      'nombres': serializer.toJson<String>(nombres),
      'apellidoPaterno': serializer.toJson<String>(apellidoPaterno),
      'apellidoMaterno': serializer.toJson<String>(apellidoMaterno),
      'correoElectronico': serializer.toJson<String>(correoElectronico),
      'nombreUsuario': serializer.toJson<String>(nombreUsuario),
      'contrasenaHash': serializer.toJson<String>(contrasenaHash),
      'activo': serializer.toJson<bool>(activo),
      'fechaCreacion': serializer.toJson<DateTime?>(fechaCreacion),
      'fechaActualizacion': serializer.toJson<DateTime?>(fechaActualizacion),
    };
  }

  Usuario copyWith({
    String? idUsuario,
    String? idRol,
    String? nombres,
    String? apellidoPaterno,
    String? apellidoMaterno,
    String? correoElectronico,
    String? nombreUsuario,
    String? contrasenaHash,
    bool? activo,
    Value<DateTime?> fechaCreacion = const Value.absent(),
    Value<DateTime?> fechaActualizacion = const Value.absent(),
  }) => Usuario(
    idUsuario: idUsuario ?? this.idUsuario,
    idRol: idRol ?? this.idRol,
    nombres: nombres ?? this.nombres,
    apellidoPaterno: apellidoPaterno ?? this.apellidoPaterno,
    apellidoMaterno: apellidoMaterno ?? this.apellidoMaterno,
    correoElectronico: correoElectronico ?? this.correoElectronico,
    nombreUsuario: nombreUsuario ?? this.nombreUsuario,
    contrasenaHash: contrasenaHash ?? this.contrasenaHash,
    activo: activo ?? this.activo,
    fechaCreacion: fechaCreacion.present
        ? fechaCreacion.value
        : this.fechaCreacion,
    fechaActualizacion: fechaActualizacion.present
        ? fechaActualizacion.value
        : this.fechaActualizacion,
  );
  Usuario copyWithCompanion(UsuariosCompanion data) {
    return Usuario(
      idUsuario: data.idUsuario.present ? data.idUsuario.value : this.idUsuario,
      idRol: data.idRol.present ? data.idRol.value : this.idRol,
      nombres: data.nombres.present ? data.nombres.value : this.nombres,
      apellidoPaterno: data.apellidoPaterno.present
          ? data.apellidoPaterno.value
          : this.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno.present
          ? data.apellidoMaterno.value
          : this.apellidoMaterno,
      correoElectronico: data.correoElectronico.present
          ? data.correoElectronico.value
          : this.correoElectronico,
      nombreUsuario: data.nombreUsuario.present
          ? data.nombreUsuario.value
          : this.nombreUsuario,
      contrasenaHash: data.contrasenaHash.present
          ? data.contrasenaHash.value
          : this.contrasenaHash,
      activo: data.activo.present ? data.activo.value : this.activo,
      fechaCreacion: data.fechaCreacion.present
          ? data.fechaCreacion.value
          : this.fechaCreacion,
      fechaActualizacion: data.fechaActualizacion.present
          ? data.fechaActualizacion.value
          : this.fechaActualizacion,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Usuario(')
          ..write('idUsuario: $idUsuario, ')
          ..write('idRol: $idRol, ')
          ..write('nombres: $nombres, ')
          ..write('apellidoPaterno: $apellidoPaterno, ')
          ..write('apellidoMaterno: $apellidoMaterno, ')
          ..write('correoElectronico: $correoElectronico, ')
          ..write('nombreUsuario: $nombreUsuario, ')
          ..write('contrasenaHash: $contrasenaHash, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    idUsuario,
    idRol,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    correoElectronico,
    nombreUsuario,
    contrasenaHash,
    activo,
    fechaCreacion,
    fechaActualizacion,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Usuario &&
          other.idUsuario == this.idUsuario &&
          other.idRol == this.idRol &&
          other.nombres == this.nombres &&
          other.apellidoPaterno == this.apellidoPaterno &&
          other.apellidoMaterno == this.apellidoMaterno &&
          other.correoElectronico == this.correoElectronico &&
          other.nombreUsuario == this.nombreUsuario &&
          other.contrasenaHash == this.contrasenaHash &&
          other.activo == this.activo &&
          other.fechaCreacion == this.fechaCreacion &&
          other.fechaActualizacion == this.fechaActualizacion);
}

class UsuariosCompanion extends UpdateCompanion<Usuario> {
  final Value<String> idUsuario;
  final Value<String> idRol;
  final Value<String> nombres;
  final Value<String> apellidoPaterno;
  final Value<String> apellidoMaterno;
  final Value<String> correoElectronico;
  final Value<String> nombreUsuario;
  final Value<String> contrasenaHash;
  final Value<bool> activo;
  final Value<DateTime?> fechaCreacion;
  final Value<DateTime?> fechaActualizacion;
  final Value<int> rowid;
  const UsuariosCompanion({
    this.idUsuario = const Value.absent(),
    this.idRol = const Value.absent(),
    this.nombres = const Value.absent(),
    this.apellidoPaterno = const Value.absent(),
    this.apellidoMaterno = const Value.absent(),
    this.correoElectronico = const Value.absent(),
    this.nombreUsuario = const Value.absent(),
    this.contrasenaHash = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  UsuariosCompanion.insert({
    required String idUsuario,
    required String idRol,
    required String nombres,
    required String apellidoPaterno,
    required String apellidoMaterno,
    required String correoElectronico,
    required String nombreUsuario,
    required String contrasenaHash,
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : idUsuario = Value(idUsuario),
       idRol = Value(idRol),
       nombres = Value(nombres),
       apellidoPaterno = Value(apellidoPaterno),
       apellidoMaterno = Value(apellidoMaterno),
       correoElectronico = Value(correoElectronico),
       nombreUsuario = Value(nombreUsuario),
       contrasenaHash = Value(contrasenaHash);
  static Insertable<Usuario> custom({
    Expression<String>? idUsuario,
    Expression<String>? idRol,
    Expression<String>? nombres,
    Expression<String>? apellidoPaterno,
    Expression<String>? apellidoMaterno,
    Expression<String>? correoElectronico,
    Expression<String>? nombreUsuario,
    Expression<String>? contrasenaHash,
    Expression<bool>? activo,
    Expression<DateTime>? fechaCreacion,
    Expression<DateTime>? fechaActualizacion,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (idUsuario != null) 'id_usuario': idUsuario,
      if (idRol != null) 'id_rol': idRol,
      if (nombres != null) 'nombres': nombres,
      if (apellidoPaterno != null) 'apellido_paterno': apellidoPaterno,
      if (apellidoMaterno != null) 'apellido_materno': apellidoMaterno,
      if (correoElectronico != null) 'correo_electronico': correoElectronico,
      if (nombreUsuario != null) 'nombre_usuario': nombreUsuario,
      if (contrasenaHash != null) 'contrasena_hash': contrasenaHash,
      if (activo != null) 'activo': activo,
      if (fechaCreacion != null) 'fecha_creacion': fechaCreacion,
      if (fechaActualizacion != null) 'fecha_actualizacion': fechaActualizacion,
      if (rowid != null) 'rowid': rowid,
    });
  }

  UsuariosCompanion copyWith({
    Value<String>? idUsuario,
    Value<String>? idRol,
    Value<String>? nombres,
    Value<String>? apellidoPaterno,
    Value<String>? apellidoMaterno,
    Value<String>? correoElectronico,
    Value<String>? nombreUsuario,
    Value<String>? contrasenaHash,
    Value<bool>? activo,
    Value<DateTime?>? fechaCreacion,
    Value<DateTime?>? fechaActualizacion,
    Value<int>? rowid,
  }) {
    return UsuariosCompanion(
      idUsuario: idUsuario ?? this.idUsuario,
      idRol: idRol ?? this.idRol,
      nombres: nombres ?? this.nombres,
      apellidoPaterno: apellidoPaterno ?? this.apellidoPaterno,
      apellidoMaterno: apellidoMaterno ?? this.apellidoMaterno,
      correoElectronico: correoElectronico ?? this.correoElectronico,
      nombreUsuario: nombreUsuario ?? this.nombreUsuario,
      contrasenaHash: contrasenaHash ?? this.contrasenaHash,
      activo: activo ?? this.activo,
      fechaCreacion: fechaCreacion ?? this.fechaCreacion,
      fechaActualizacion: fechaActualizacion ?? this.fechaActualizacion,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (idUsuario.present) {
      map['id_usuario'] = Variable<String>(idUsuario.value);
    }
    if (idRol.present) {
      map['id_rol'] = Variable<String>(idRol.value);
    }
    if (nombres.present) {
      map['nombres'] = Variable<String>(nombres.value);
    }
    if (apellidoPaterno.present) {
      map['apellido_paterno'] = Variable<String>(apellidoPaterno.value);
    }
    if (apellidoMaterno.present) {
      map['apellido_materno'] = Variable<String>(apellidoMaterno.value);
    }
    if (correoElectronico.present) {
      map['correo_electronico'] = Variable<String>(correoElectronico.value);
    }
    if (nombreUsuario.present) {
      map['nombre_usuario'] = Variable<String>(nombreUsuario.value);
    }
    if (contrasenaHash.present) {
      map['contrasena_hash'] = Variable<String>(contrasenaHash.value);
    }
    if (activo.present) {
      map['activo'] = Variable<bool>(activo.value);
    }
    if (fechaCreacion.present) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion.value);
    }
    if (fechaActualizacion.present) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsuariosCompanion(')
          ..write('idUsuario: $idUsuario, ')
          ..write('idRol: $idRol, ')
          ..write('nombres: $nombres, ')
          ..write('apellidoPaterno: $apellidoPaterno, ')
          ..write('apellidoMaterno: $apellidoMaterno, ')
          ..write('correoElectronico: $correoElectronico, ')
          ..write('nombreUsuario: $nombreUsuario, ')
          ..write('contrasenaHash: $contrasenaHash, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $EstatusProspeccionesTable extends EstatusProspecciones
    with TableInfo<$EstatusProspeccionesTable, EstatusProspeccione> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $EstatusProspeccionesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idEstatusProspeccionMeta =
      const VerificationMeta('idEstatusProspeccion');
  @override
  late final GeneratedColumn<String> idEstatusProspeccion =
      GeneratedColumn<String>(
        'id_estatus_prospeccion',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _descripcionMeta = const VerificationMeta(
    'descripcion',
  );
  @override
  late final GeneratedColumn<String> descripcion = GeneratedColumn<String>(
    'descripcion',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 100,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _activoMeta = const VerificationMeta('activo');
  @override
  late final GeneratedColumn<bool> activo = GeneratedColumn<bool>(
    'activo',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("activo" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  @override
  List<GeneratedColumn> get $columns => [
    idEstatusProspeccion,
    descripcion,
    activo,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'estatus_prospecciones';
  @override
  VerificationContext validateIntegrity(
    Insertable<EstatusProspeccione> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id_estatus_prospeccion')) {
      context.handle(
        _idEstatusProspeccionMeta,
        idEstatusProspeccion.isAcceptableOrUnknown(
          data['id_estatus_prospeccion']!,
          _idEstatusProspeccionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_idEstatusProspeccionMeta);
    }
    if (data.containsKey('descripcion')) {
      context.handle(
        _descripcionMeta,
        descripcion.isAcceptableOrUnknown(
          data['descripcion']!,
          _descripcionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_descripcionMeta);
    }
    if (data.containsKey('activo')) {
      context.handle(
        _activoMeta,
        activo.isAcceptableOrUnknown(data['activo']!, _activoMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {idEstatusProspeccion};
  @override
  EstatusProspeccione map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return EstatusProspeccione(
      idEstatusProspeccion: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_estatus_prospeccion'],
      )!,
      descripcion: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}descripcion'],
      )!,
      activo: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}activo'],
      )!,
    );
  }

  @override
  $EstatusProspeccionesTable createAlias(String alias) {
    return $EstatusProspeccionesTable(attachedDatabase, alias);
  }
}

class EstatusProspeccione extends DataClass
    implements Insertable<EstatusProspeccione> {
  final String idEstatusProspeccion;
  final String descripcion;
  final bool activo;
  const EstatusProspeccione({
    required this.idEstatusProspeccion,
    required this.descripcion,
    required this.activo,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id_estatus_prospeccion'] = Variable<String>(idEstatusProspeccion);
    map['descripcion'] = Variable<String>(descripcion);
    map['activo'] = Variable<bool>(activo);
    return map;
  }

  EstatusProspeccionesCompanion toCompanion(bool nullToAbsent) {
    return EstatusProspeccionesCompanion(
      idEstatusProspeccion: Value(idEstatusProspeccion),
      descripcion: Value(descripcion),
      activo: Value(activo),
    );
  }

  factory EstatusProspeccione.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return EstatusProspeccione(
      idEstatusProspeccion: serializer.fromJson<String>(
        json['idEstatusProspeccion'],
      ),
      descripcion: serializer.fromJson<String>(json['descripcion']),
      activo: serializer.fromJson<bool>(json['activo']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'idEstatusProspeccion': serializer.toJson<String>(idEstatusProspeccion),
      'descripcion': serializer.toJson<String>(descripcion),
      'activo': serializer.toJson<bool>(activo),
    };
  }

  EstatusProspeccione copyWith({
    String? idEstatusProspeccion,
    String? descripcion,
    bool? activo,
  }) => EstatusProspeccione(
    idEstatusProspeccion: idEstatusProspeccion ?? this.idEstatusProspeccion,
    descripcion: descripcion ?? this.descripcion,
    activo: activo ?? this.activo,
  );
  EstatusProspeccione copyWithCompanion(EstatusProspeccionesCompanion data) {
    return EstatusProspeccione(
      idEstatusProspeccion: data.idEstatusProspeccion.present
          ? data.idEstatusProspeccion.value
          : this.idEstatusProspeccion,
      descripcion: data.descripcion.present
          ? data.descripcion.value
          : this.descripcion,
      activo: data.activo.present ? data.activo.value : this.activo,
    );
  }

  @override
  String toString() {
    return (StringBuffer('EstatusProspeccione(')
          ..write('idEstatusProspeccion: $idEstatusProspeccion, ')
          ..write('descripcion: $descripcion, ')
          ..write('activo: $activo')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(idEstatusProspeccion, descripcion, activo);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is EstatusProspeccione &&
          other.idEstatusProspeccion == this.idEstatusProspeccion &&
          other.descripcion == this.descripcion &&
          other.activo == this.activo);
}

class EstatusProspeccionesCompanion
    extends UpdateCompanion<EstatusProspeccione> {
  final Value<String> idEstatusProspeccion;
  final Value<String> descripcion;
  final Value<bool> activo;
  final Value<int> rowid;
  const EstatusProspeccionesCompanion({
    this.idEstatusProspeccion = const Value.absent(),
    this.descripcion = const Value.absent(),
    this.activo = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  EstatusProspeccionesCompanion.insert({
    required String idEstatusProspeccion,
    required String descripcion,
    this.activo = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : idEstatusProspeccion = Value(idEstatusProspeccion),
       descripcion = Value(descripcion);
  static Insertable<EstatusProspeccione> custom({
    Expression<String>? idEstatusProspeccion,
    Expression<String>? descripcion,
    Expression<bool>? activo,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (idEstatusProspeccion != null)
        'id_estatus_prospeccion': idEstatusProspeccion,
      if (descripcion != null) 'descripcion': descripcion,
      if (activo != null) 'activo': activo,
      if (rowid != null) 'rowid': rowid,
    });
  }

  EstatusProspeccionesCompanion copyWith({
    Value<String>? idEstatusProspeccion,
    Value<String>? descripcion,
    Value<bool>? activo,
    Value<int>? rowid,
  }) {
    return EstatusProspeccionesCompanion(
      idEstatusProspeccion: idEstatusProspeccion ?? this.idEstatusProspeccion,
      descripcion: descripcion ?? this.descripcion,
      activo: activo ?? this.activo,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (idEstatusProspeccion.present) {
      map['id_estatus_prospeccion'] = Variable<String>(
        idEstatusProspeccion.value,
      );
    }
    if (descripcion.present) {
      map['descripcion'] = Variable<String>(descripcion.value);
    }
    if (activo.present) {
      map['activo'] = Variable<bool>(activo.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('EstatusProspeccionesCompanion(')
          ..write('idEstatusProspeccion: $idEstatusProspeccion, ')
          ..write('descripcion: $descripcion, ')
          ..write('activo: $activo, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ProspeccionLotesTable extends ProspeccionLotes
    with TableInfo<$ProspeccionLotesTable, ProspeccionLote> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ProspeccionLotesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idLoteMeta = const VerificationMeta('idLote');
  @override
  late final GeneratedColumn<String> idLote = GeneratedColumn<String>(
    'id_lote',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _idEstatusProspeccionMeta =
      const VerificationMeta('idEstatusProspeccion');
  @override
  late final GeneratedColumn<String> idEstatusProspeccion =
      GeneratedColumn<String>(
        'id_estatus_prospeccion',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
        defaultConstraints: GeneratedColumn.constraintIsAlways(
          'REFERENCES estatus_prospecciones (id_estatus_prospeccion)',
        ),
      );
  static const VerificationMeta _idResponsableMeta = const VerificationMeta(
    'idResponsable',
  );
  @override
  late final GeneratedColumn<String> idResponsable = GeneratedColumn<String>(
    'id_responsable',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES usuarios (id_usuario)',
    ),
  );
  static const VerificationMeta _idMinaMeta = const VerificationMeta('idMina');
  @override
  late final GeneratedColumn<String> idMina = GeneratedColumn<String>(
    'id_mina',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nombreAliasMeta = const VerificationMeta(
    'nombreAlias',
  );
  @override
  late final GeneratedColumn<String> nombreAlias = GeneratedColumn<String>(
    'nombre_alias',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 150,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _fechaRegistroMeta = const VerificationMeta(
    'fechaRegistro',
  );
  @override
  late final GeneratedColumn<DateTime> fechaRegistro =
      GeneratedColumn<DateTime>(
        'fecha_registro',
        aliasedName,
        false,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _fechaMuestreoMeta = const VerificationMeta(
    'fechaMuestreo',
  );
  @override
  late final GeneratedColumn<DateTime> fechaMuestreo =
      GeneratedColumn<DateTime>(
        'fecha_muestreo',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _metodoMuestreoMeta = const VerificationMeta(
    'metodoMuestreo',
  );
  @override
  late final GeneratedColumn<String> metodoMuestreo = GeneratedColumn<String>(
    'metodo_muestreo',
    aliasedName,
    true,
    additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 100),
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _leyEstimadaMeta = const VerificationMeta(
    'leyEstimada',
  );
  @override
  late final GeneratedColumn<double> leyEstimada = GeneratedColumn<double>(
    'ley_estimada',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _tonelajeEstimadoMeta = const VerificationMeta(
    'tonelajeEstimado',
  );
  @override
  late final GeneratedColumn<double> tonelajeEstimado = GeneratedColumn<double>(
    'tonelaje_estimado',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _observacionesMeta = const VerificationMeta(
    'observaciones',
  );
  @override
  late final GeneratedColumn<String> observaciones = GeneratedColumn<String>(
    'observaciones',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _activoMeta = const VerificationMeta('activo');
  @override
  late final GeneratedColumn<bool> activo = GeneratedColumn<bool>(
    'activo',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("activo" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _fechaCreacionMeta = const VerificationMeta(
    'fechaCreacion',
  );
  @override
  late final GeneratedColumn<DateTime> fechaCreacion =
      GeneratedColumn<DateTime>(
        'fecha_creacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _fechaActualizacionMeta =
      const VerificationMeta('fechaActualizacion');
  @override
  late final GeneratedColumn<DateTime> fechaActualizacion =
      GeneratedColumn<DateTime>(
        'fecha_actualizacion',
        aliasedName,
        true,
        type: DriftSqlType.dateTime,
        requiredDuringInsert: false,
      );
  @override
  List<GeneratedColumn> get $columns => [
    idLote,
    idEstatusProspeccion,
    idResponsable,
    idMina,
    nombreAlias,
    fechaRegistro,
    fechaMuestreo,
    metodoMuestreo,
    leyEstimada,
    tonelajeEstimado,
    observaciones,
    activo,
    fechaCreacion,
    fechaActualizacion,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'prospeccion_lotes';
  @override
  VerificationContext validateIntegrity(
    Insertable<ProspeccionLote> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id_lote')) {
      context.handle(
        _idLoteMeta,
        idLote.isAcceptableOrUnknown(data['id_lote']!, _idLoteMeta),
      );
    } else if (isInserting) {
      context.missing(_idLoteMeta);
    }
    if (data.containsKey('id_estatus_prospeccion')) {
      context.handle(
        _idEstatusProspeccionMeta,
        idEstatusProspeccion.isAcceptableOrUnknown(
          data['id_estatus_prospeccion']!,
          _idEstatusProspeccionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_idEstatusProspeccionMeta);
    }
    if (data.containsKey('id_responsable')) {
      context.handle(
        _idResponsableMeta,
        idResponsable.isAcceptableOrUnknown(
          data['id_responsable']!,
          _idResponsableMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_idResponsableMeta);
    }
    if (data.containsKey('id_mina')) {
      context.handle(
        _idMinaMeta,
        idMina.isAcceptableOrUnknown(data['id_mina']!, _idMinaMeta),
      );
    } else if (isInserting) {
      context.missing(_idMinaMeta);
    }
    if (data.containsKey('nombre_alias')) {
      context.handle(
        _nombreAliasMeta,
        nombreAlias.isAcceptableOrUnknown(
          data['nombre_alias']!,
          _nombreAliasMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_nombreAliasMeta);
    }
    if (data.containsKey('fecha_registro')) {
      context.handle(
        _fechaRegistroMeta,
        fechaRegistro.isAcceptableOrUnknown(
          data['fecha_registro']!,
          _fechaRegistroMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_fechaRegistroMeta);
    }
    if (data.containsKey('fecha_muestreo')) {
      context.handle(
        _fechaMuestreoMeta,
        fechaMuestreo.isAcceptableOrUnknown(
          data['fecha_muestreo']!,
          _fechaMuestreoMeta,
        ),
      );
    }
    if (data.containsKey('metodo_muestreo')) {
      context.handle(
        _metodoMuestreoMeta,
        metodoMuestreo.isAcceptableOrUnknown(
          data['metodo_muestreo']!,
          _metodoMuestreoMeta,
        ),
      );
    }
    if (data.containsKey('ley_estimada')) {
      context.handle(
        _leyEstimadaMeta,
        leyEstimada.isAcceptableOrUnknown(
          data['ley_estimada']!,
          _leyEstimadaMeta,
        ),
      );
    }
    if (data.containsKey('tonelaje_estimado')) {
      context.handle(
        _tonelajeEstimadoMeta,
        tonelajeEstimado.isAcceptableOrUnknown(
          data['tonelaje_estimado']!,
          _tonelajeEstimadoMeta,
        ),
      );
    }
    if (data.containsKey('observaciones')) {
      context.handle(
        _observacionesMeta,
        observaciones.isAcceptableOrUnknown(
          data['observaciones']!,
          _observacionesMeta,
        ),
      );
    }
    if (data.containsKey('activo')) {
      context.handle(
        _activoMeta,
        activo.isAcceptableOrUnknown(data['activo']!, _activoMeta),
      );
    }
    if (data.containsKey('fecha_creacion')) {
      context.handle(
        _fechaCreacionMeta,
        fechaCreacion.isAcceptableOrUnknown(
          data['fecha_creacion']!,
          _fechaCreacionMeta,
        ),
      );
    }
    if (data.containsKey('fecha_actualizacion')) {
      context.handle(
        _fechaActualizacionMeta,
        fechaActualizacion.isAcceptableOrUnknown(
          data['fecha_actualizacion']!,
          _fechaActualizacionMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {idLote};
  @override
  ProspeccionLote map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ProspeccionLote(
      idLote: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_lote'],
      )!,
      idEstatusProspeccion: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_estatus_prospeccion'],
      )!,
      idResponsable: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_responsable'],
      )!,
      idMina: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_mina'],
      )!,
      nombreAlias: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nombre_alias'],
      )!,
      fechaRegistro: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_registro'],
      )!,
      fechaMuestreo: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_muestreo'],
      ),
      metodoMuestreo: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}metodo_muestreo'],
      ),
      leyEstimada: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}ley_estimada'],
      ),
      tonelajeEstimado: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}tonelaje_estimado'],
      ),
      observaciones: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}observaciones'],
      ),
      activo: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}activo'],
      )!,
      fechaCreacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_creacion'],
      ),
      fechaActualizacion: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_actualizacion'],
      ),
    );
  }

  @override
  $ProspeccionLotesTable createAlias(String alias) {
    return $ProspeccionLotesTable(attachedDatabase, alias);
  }
}

class ProspeccionLote extends DataClass implements Insertable<ProspeccionLote> {
  final String idLote;
  final String idEstatusProspeccion;
  final String idResponsable;
  final String idMina;
  final String nombreAlias;
  final DateTime fechaRegistro;
  final DateTime? fechaMuestreo;
  final String? metodoMuestreo;
  final double? leyEstimada;
  final double? tonelajeEstimado;
  final String? observaciones;
  final bool activo;
  final DateTime? fechaCreacion;
  final DateTime? fechaActualizacion;
  const ProspeccionLote({
    required this.idLote,
    required this.idEstatusProspeccion,
    required this.idResponsable,
    required this.idMina,
    required this.nombreAlias,
    required this.fechaRegistro,
    this.fechaMuestreo,
    this.metodoMuestreo,
    this.leyEstimada,
    this.tonelajeEstimado,
    this.observaciones,
    required this.activo,
    this.fechaCreacion,
    this.fechaActualizacion,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id_lote'] = Variable<String>(idLote);
    map['id_estatus_prospeccion'] = Variable<String>(idEstatusProspeccion);
    map['id_responsable'] = Variable<String>(idResponsable);
    map['id_mina'] = Variable<String>(idMina);
    map['nombre_alias'] = Variable<String>(nombreAlias);
    map['fecha_registro'] = Variable<DateTime>(fechaRegistro);
    if (!nullToAbsent || fechaMuestreo != null) {
      map['fecha_muestreo'] = Variable<DateTime>(fechaMuestreo);
    }
    if (!nullToAbsent || metodoMuestreo != null) {
      map['metodo_muestreo'] = Variable<String>(metodoMuestreo);
    }
    if (!nullToAbsent || leyEstimada != null) {
      map['ley_estimada'] = Variable<double>(leyEstimada);
    }
    if (!nullToAbsent || tonelajeEstimado != null) {
      map['tonelaje_estimado'] = Variable<double>(tonelajeEstimado);
    }
    if (!nullToAbsent || observaciones != null) {
      map['observaciones'] = Variable<String>(observaciones);
    }
    map['activo'] = Variable<bool>(activo);
    if (!nullToAbsent || fechaCreacion != null) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion);
    }
    if (!nullToAbsent || fechaActualizacion != null) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion);
    }
    return map;
  }

  ProspeccionLotesCompanion toCompanion(bool nullToAbsent) {
    return ProspeccionLotesCompanion(
      idLote: Value(idLote),
      idEstatusProspeccion: Value(idEstatusProspeccion),
      idResponsable: Value(idResponsable),
      idMina: Value(idMina),
      nombreAlias: Value(nombreAlias),
      fechaRegistro: Value(fechaRegistro),
      fechaMuestreo: fechaMuestreo == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaMuestreo),
      metodoMuestreo: metodoMuestreo == null && nullToAbsent
          ? const Value.absent()
          : Value(metodoMuestreo),
      leyEstimada: leyEstimada == null && nullToAbsent
          ? const Value.absent()
          : Value(leyEstimada),
      tonelajeEstimado: tonelajeEstimado == null && nullToAbsent
          ? const Value.absent()
          : Value(tonelajeEstimado),
      observaciones: observaciones == null && nullToAbsent
          ? const Value.absent()
          : Value(observaciones),
      activo: Value(activo),
      fechaCreacion: fechaCreacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaCreacion),
      fechaActualizacion: fechaActualizacion == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaActualizacion),
    );
  }

  factory ProspeccionLote.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ProspeccionLote(
      idLote: serializer.fromJson<String>(json['idLote']),
      idEstatusProspeccion: serializer.fromJson<String>(
        json['idEstatusProspeccion'],
      ),
      idResponsable: serializer.fromJson<String>(json['idResponsable']),
      idMina: serializer.fromJson<String>(json['idMina']),
      nombreAlias: serializer.fromJson<String>(json['nombreAlias']),
      fechaRegistro: serializer.fromJson<DateTime>(json['fechaRegistro']),
      fechaMuestreo: serializer.fromJson<DateTime?>(json['fechaMuestreo']),
      metodoMuestreo: serializer.fromJson<String?>(json['metodoMuestreo']),
      leyEstimada: serializer.fromJson<double?>(json['leyEstimada']),
      tonelajeEstimado: serializer.fromJson<double?>(json['tonelajeEstimado']),
      observaciones: serializer.fromJson<String?>(json['observaciones']),
      activo: serializer.fromJson<bool>(json['activo']),
      fechaCreacion: serializer.fromJson<DateTime?>(json['fechaCreacion']),
      fechaActualizacion: serializer.fromJson<DateTime?>(
        json['fechaActualizacion'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'idLote': serializer.toJson<String>(idLote),
      'idEstatusProspeccion': serializer.toJson<String>(idEstatusProspeccion),
      'idResponsable': serializer.toJson<String>(idResponsable),
      'idMina': serializer.toJson<String>(idMina),
      'nombreAlias': serializer.toJson<String>(nombreAlias),
      'fechaRegistro': serializer.toJson<DateTime>(fechaRegistro),
      'fechaMuestreo': serializer.toJson<DateTime?>(fechaMuestreo),
      'metodoMuestreo': serializer.toJson<String?>(metodoMuestreo),
      'leyEstimada': serializer.toJson<double?>(leyEstimada),
      'tonelajeEstimado': serializer.toJson<double?>(tonelajeEstimado),
      'observaciones': serializer.toJson<String?>(observaciones),
      'activo': serializer.toJson<bool>(activo),
      'fechaCreacion': serializer.toJson<DateTime?>(fechaCreacion),
      'fechaActualizacion': serializer.toJson<DateTime?>(fechaActualizacion),
    };
  }

  ProspeccionLote copyWith({
    String? idLote,
    String? idEstatusProspeccion,
    String? idResponsable,
    String? idMina,
    String? nombreAlias,
    DateTime? fechaRegistro,
    Value<DateTime?> fechaMuestreo = const Value.absent(),
    Value<String?> metodoMuestreo = const Value.absent(),
    Value<double?> leyEstimada = const Value.absent(),
    Value<double?> tonelajeEstimado = const Value.absent(),
    Value<String?> observaciones = const Value.absent(),
    bool? activo,
    Value<DateTime?> fechaCreacion = const Value.absent(),
    Value<DateTime?> fechaActualizacion = const Value.absent(),
  }) => ProspeccionLote(
    idLote: idLote ?? this.idLote,
    idEstatusProspeccion: idEstatusProspeccion ?? this.idEstatusProspeccion,
    idResponsable: idResponsable ?? this.idResponsable,
    idMina: idMina ?? this.idMina,
    nombreAlias: nombreAlias ?? this.nombreAlias,
    fechaRegistro: fechaRegistro ?? this.fechaRegistro,
    fechaMuestreo: fechaMuestreo.present
        ? fechaMuestreo.value
        : this.fechaMuestreo,
    metodoMuestreo: metodoMuestreo.present
        ? metodoMuestreo.value
        : this.metodoMuestreo,
    leyEstimada: leyEstimada.present ? leyEstimada.value : this.leyEstimada,
    tonelajeEstimado: tonelajeEstimado.present
        ? tonelajeEstimado.value
        : this.tonelajeEstimado,
    observaciones: observaciones.present
        ? observaciones.value
        : this.observaciones,
    activo: activo ?? this.activo,
    fechaCreacion: fechaCreacion.present
        ? fechaCreacion.value
        : this.fechaCreacion,
    fechaActualizacion: fechaActualizacion.present
        ? fechaActualizacion.value
        : this.fechaActualizacion,
  );
  ProspeccionLote copyWithCompanion(ProspeccionLotesCompanion data) {
    return ProspeccionLote(
      idLote: data.idLote.present ? data.idLote.value : this.idLote,
      idEstatusProspeccion: data.idEstatusProspeccion.present
          ? data.idEstatusProspeccion.value
          : this.idEstatusProspeccion,
      idResponsable: data.idResponsable.present
          ? data.idResponsable.value
          : this.idResponsable,
      idMina: data.idMina.present ? data.idMina.value : this.idMina,
      nombreAlias: data.nombreAlias.present
          ? data.nombreAlias.value
          : this.nombreAlias,
      fechaRegistro: data.fechaRegistro.present
          ? data.fechaRegistro.value
          : this.fechaRegistro,
      fechaMuestreo: data.fechaMuestreo.present
          ? data.fechaMuestreo.value
          : this.fechaMuestreo,
      metodoMuestreo: data.metodoMuestreo.present
          ? data.metodoMuestreo.value
          : this.metodoMuestreo,
      leyEstimada: data.leyEstimada.present
          ? data.leyEstimada.value
          : this.leyEstimada,
      tonelajeEstimado: data.tonelajeEstimado.present
          ? data.tonelajeEstimado.value
          : this.tonelajeEstimado,
      observaciones: data.observaciones.present
          ? data.observaciones.value
          : this.observaciones,
      activo: data.activo.present ? data.activo.value : this.activo,
      fechaCreacion: data.fechaCreacion.present
          ? data.fechaCreacion.value
          : this.fechaCreacion,
      fechaActualizacion: data.fechaActualizacion.present
          ? data.fechaActualizacion.value
          : this.fechaActualizacion,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ProspeccionLote(')
          ..write('idLote: $idLote, ')
          ..write('idEstatusProspeccion: $idEstatusProspeccion, ')
          ..write('idResponsable: $idResponsable, ')
          ..write('idMina: $idMina, ')
          ..write('nombreAlias: $nombreAlias, ')
          ..write('fechaRegistro: $fechaRegistro, ')
          ..write('fechaMuestreo: $fechaMuestreo, ')
          ..write('metodoMuestreo: $metodoMuestreo, ')
          ..write('leyEstimada: $leyEstimada, ')
          ..write('tonelajeEstimado: $tonelajeEstimado, ')
          ..write('observaciones: $observaciones, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    idLote,
    idEstatusProspeccion,
    idResponsable,
    idMina,
    nombreAlias,
    fechaRegistro,
    fechaMuestreo,
    metodoMuestreo,
    leyEstimada,
    tonelajeEstimado,
    observaciones,
    activo,
    fechaCreacion,
    fechaActualizacion,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ProspeccionLote &&
          other.idLote == this.idLote &&
          other.idEstatusProspeccion == this.idEstatusProspeccion &&
          other.idResponsable == this.idResponsable &&
          other.idMina == this.idMina &&
          other.nombreAlias == this.nombreAlias &&
          other.fechaRegistro == this.fechaRegistro &&
          other.fechaMuestreo == this.fechaMuestreo &&
          other.metodoMuestreo == this.metodoMuestreo &&
          other.leyEstimada == this.leyEstimada &&
          other.tonelajeEstimado == this.tonelajeEstimado &&
          other.observaciones == this.observaciones &&
          other.activo == this.activo &&
          other.fechaCreacion == this.fechaCreacion &&
          other.fechaActualizacion == this.fechaActualizacion);
}

class ProspeccionLotesCompanion extends UpdateCompanion<ProspeccionLote> {
  final Value<String> idLote;
  final Value<String> idEstatusProspeccion;
  final Value<String> idResponsable;
  final Value<String> idMina;
  final Value<String> nombreAlias;
  final Value<DateTime> fechaRegistro;
  final Value<DateTime?> fechaMuestreo;
  final Value<String?> metodoMuestreo;
  final Value<double?> leyEstimada;
  final Value<double?> tonelajeEstimado;
  final Value<String?> observaciones;
  final Value<bool> activo;
  final Value<DateTime?> fechaCreacion;
  final Value<DateTime?> fechaActualizacion;
  final Value<int> rowid;
  const ProspeccionLotesCompanion({
    this.idLote = const Value.absent(),
    this.idEstatusProspeccion = const Value.absent(),
    this.idResponsable = const Value.absent(),
    this.idMina = const Value.absent(),
    this.nombreAlias = const Value.absent(),
    this.fechaRegistro = const Value.absent(),
    this.fechaMuestreo = const Value.absent(),
    this.metodoMuestreo = const Value.absent(),
    this.leyEstimada = const Value.absent(),
    this.tonelajeEstimado = const Value.absent(),
    this.observaciones = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ProspeccionLotesCompanion.insert({
    required String idLote,
    required String idEstatusProspeccion,
    required String idResponsable,
    required String idMina,
    required String nombreAlias,
    required DateTime fechaRegistro,
    this.fechaMuestreo = const Value.absent(),
    this.metodoMuestreo = const Value.absent(),
    this.leyEstimada = const Value.absent(),
    this.tonelajeEstimado = const Value.absent(),
    this.observaciones = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCreacion = const Value.absent(),
    this.fechaActualizacion = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : idLote = Value(idLote),
       idEstatusProspeccion = Value(idEstatusProspeccion),
       idResponsable = Value(idResponsable),
       idMina = Value(idMina),
       nombreAlias = Value(nombreAlias),
       fechaRegistro = Value(fechaRegistro);
  static Insertable<ProspeccionLote> custom({
    Expression<String>? idLote,
    Expression<String>? idEstatusProspeccion,
    Expression<String>? idResponsable,
    Expression<String>? idMina,
    Expression<String>? nombreAlias,
    Expression<DateTime>? fechaRegistro,
    Expression<DateTime>? fechaMuestreo,
    Expression<String>? metodoMuestreo,
    Expression<double>? leyEstimada,
    Expression<double>? tonelajeEstimado,
    Expression<String>? observaciones,
    Expression<bool>? activo,
    Expression<DateTime>? fechaCreacion,
    Expression<DateTime>? fechaActualizacion,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (idLote != null) 'id_lote': idLote,
      if (idEstatusProspeccion != null)
        'id_estatus_prospeccion': idEstatusProspeccion,
      if (idResponsable != null) 'id_responsable': idResponsable,
      if (idMina != null) 'id_mina': idMina,
      if (nombreAlias != null) 'nombre_alias': nombreAlias,
      if (fechaRegistro != null) 'fecha_registro': fechaRegistro,
      if (fechaMuestreo != null) 'fecha_muestreo': fechaMuestreo,
      if (metodoMuestreo != null) 'metodo_muestreo': metodoMuestreo,
      if (leyEstimada != null) 'ley_estimada': leyEstimada,
      if (tonelajeEstimado != null) 'tonelaje_estimado': tonelajeEstimado,
      if (observaciones != null) 'observaciones': observaciones,
      if (activo != null) 'activo': activo,
      if (fechaCreacion != null) 'fecha_creacion': fechaCreacion,
      if (fechaActualizacion != null) 'fecha_actualizacion': fechaActualizacion,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ProspeccionLotesCompanion copyWith({
    Value<String>? idLote,
    Value<String>? idEstatusProspeccion,
    Value<String>? idResponsable,
    Value<String>? idMina,
    Value<String>? nombreAlias,
    Value<DateTime>? fechaRegistro,
    Value<DateTime?>? fechaMuestreo,
    Value<String?>? metodoMuestreo,
    Value<double?>? leyEstimada,
    Value<double?>? tonelajeEstimado,
    Value<String?>? observaciones,
    Value<bool>? activo,
    Value<DateTime?>? fechaCreacion,
    Value<DateTime?>? fechaActualizacion,
    Value<int>? rowid,
  }) {
    return ProspeccionLotesCompanion(
      idLote: idLote ?? this.idLote,
      idEstatusProspeccion: idEstatusProspeccion ?? this.idEstatusProspeccion,
      idResponsable: idResponsable ?? this.idResponsable,
      idMina: idMina ?? this.idMina,
      nombreAlias: nombreAlias ?? this.nombreAlias,
      fechaRegistro: fechaRegistro ?? this.fechaRegistro,
      fechaMuestreo: fechaMuestreo ?? this.fechaMuestreo,
      metodoMuestreo: metodoMuestreo ?? this.metodoMuestreo,
      leyEstimada: leyEstimada ?? this.leyEstimada,
      tonelajeEstimado: tonelajeEstimado ?? this.tonelajeEstimado,
      observaciones: observaciones ?? this.observaciones,
      activo: activo ?? this.activo,
      fechaCreacion: fechaCreacion ?? this.fechaCreacion,
      fechaActualizacion: fechaActualizacion ?? this.fechaActualizacion,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (idLote.present) {
      map['id_lote'] = Variable<String>(idLote.value);
    }
    if (idEstatusProspeccion.present) {
      map['id_estatus_prospeccion'] = Variable<String>(
        idEstatusProspeccion.value,
      );
    }
    if (idResponsable.present) {
      map['id_responsable'] = Variable<String>(idResponsable.value);
    }
    if (idMina.present) {
      map['id_mina'] = Variable<String>(idMina.value);
    }
    if (nombreAlias.present) {
      map['nombre_alias'] = Variable<String>(nombreAlias.value);
    }
    if (fechaRegistro.present) {
      map['fecha_registro'] = Variable<DateTime>(fechaRegistro.value);
    }
    if (fechaMuestreo.present) {
      map['fecha_muestreo'] = Variable<DateTime>(fechaMuestreo.value);
    }
    if (metodoMuestreo.present) {
      map['metodo_muestreo'] = Variable<String>(metodoMuestreo.value);
    }
    if (leyEstimada.present) {
      map['ley_estimada'] = Variable<double>(leyEstimada.value);
    }
    if (tonelajeEstimado.present) {
      map['tonelaje_estimado'] = Variable<double>(tonelajeEstimado.value);
    }
    if (observaciones.present) {
      map['observaciones'] = Variable<String>(observaciones.value);
    }
    if (activo.present) {
      map['activo'] = Variable<bool>(activo.value);
    }
    if (fechaCreacion.present) {
      map['fecha_creacion'] = Variable<DateTime>(fechaCreacion.value);
    }
    if (fechaActualizacion.present) {
      map['fecha_actualizacion'] = Variable<DateTime>(fechaActualizacion.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ProspeccionLotesCompanion(')
          ..write('idLote: $idLote, ')
          ..write('idEstatusProspeccion: $idEstatusProspeccion, ')
          ..write('idResponsable: $idResponsable, ')
          ..write('idMina: $idMina, ')
          ..write('nombreAlias: $nombreAlias, ')
          ..write('fechaRegistro: $fechaRegistro, ')
          ..write('fechaMuestreo: $fechaMuestreo, ')
          ..write('metodoMuestreo: $metodoMuestreo, ')
          ..write('leyEstimada: $leyEstimada, ')
          ..write('tonelajeEstimado: $tonelajeEstimado, ')
          ..write('observaciones: $observaciones, ')
          ..write('activo: $activo, ')
          ..write('fechaCreacion: $fechaCreacion, ')
          ..write('fechaActualizacion: $fechaActualizacion, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $LoteCoordenadasTable extends LoteCoordenadas
    with TableInfo<$LoteCoordenadasTable, LoteCoordenada> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LoteCoordenadasTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idCoordenadaMeta = const VerificationMeta(
    'idCoordenada',
  );
  @override
  late final GeneratedColumn<String> idCoordenada = GeneratedColumn<String>(
    'id_coordenada',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _idLoteMeta = const VerificationMeta('idLote');
  @override
  late final GeneratedColumn<String> idLote = GeneratedColumn<String>(
    'id_lote',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES prospeccion_lotes (id_lote)',
    ),
  );
  static const VerificationMeta _latitudMeta = const VerificationMeta(
    'latitud',
  );
  @override
  late final GeneratedColumn<double> latitud = GeneratedColumn<double>(
    'latitud',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _longitudMeta = const VerificationMeta(
    'longitud',
  );
  @override
  late final GeneratedColumn<double> longitud = GeneratedColumn<double>(
    'longitud',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _altitudMeta = const VerificationMeta(
    'altitud',
  );
  @override
  late final GeneratedColumn<double> altitud = GeneratedColumn<double>(
    'altitud',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _precisionGPSMeta = const VerificationMeta(
    'precisionGPS',
  );
  @override
  late final GeneratedColumn<double> precisionGPS = GeneratedColumn<double>(
    'precision_g_p_s',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _ordenSecuenciaMeta = const VerificationMeta(
    'ordenSecuencia',
  );
  @override
  late final GeneratedColumn<int> ordenSecuencia = GeneratedColumn<int>(
    'orden_secuencia',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _activoMeta = const VerificationMeta('activo');
  @override
  late final GeneratedColumn<bool> activo = GeneratedColumn<bool>(
    'activo',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("activo" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _fechaCapturaMeta = const VerificationMeta(
    'fechaCaptura',
  );
  @override
  late final GeneratedColumn<DateTime> fechaCaptura = GeneratedColumn<DateTime>(
    'fecha_captura',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    idCoordenada,
    idLote,
    latitud,
    longitud,
    altitud,
    precisionGPS,
    ordenSecuencia,
    activo,
    fechaCaptura,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'lote_coordenadas';
  @override
  VerificationContext validateIntegrity(
    Insertable<LoteCoordenada> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id_coordenada')) {
      context.handle(
        _idCoordenadaMeta,
        idCoordenada.isAcceptableOrUnknown(
          data['id_coordenada']!,
          _idCoordenadaMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_idCoordenadaMeta);
    }
    if (data.containsKey('id_lote')) {
      context.handle(
        _idLoteMeta,
        idLote.isAcceptableOrUnknown(data['id_lote']!, _idLoteMeta),
      );
    } else if (isInserting) {
      context.missing(_idLoteMeta);
    }
    if (data.containsKey('latitud')) {
      context.handle(
        _latitudMeta,
        latitud.isAcceptableOrUnknown(data['latitud']!, _latitudMeta),
      );
    } else if (isInserting) {
      context.missing(_latitudMeta);
    }
    if (data.containsKey('longitud')) {
      context.handle(
        _longitudMeta,
        longitud.isAcceptableOrUnknown(data['longitud']!, _longitudMeta),
      );
    } else if (isInserting) {
      context.missing(_longitudMeta);
    }
    if (data.containsKey('altitud')) {
      context.handle(
        _altitudMeta,
        altitud.isAcceptableOrUnknown(data['altitud']!, _altitudMeta),
      );
    }
    if (data.containsKey('precision_g_p_s')) {
      context.handle(
        _precisionGPSMeta,
        precisionGPS.isAcceptableOrUnknown(
          data['precision_g_p_s']!,
          _precisionGPSMeta,
        ),
      );
    }
    if (data.containsKey('orden_secuencia')) {
      context.handle(
        _ordenSecuenciaMeta,
        ordenSecuencia.isAcceptableOrUnknown(
          data['orden_secuencia']!,
          _ordenSecuenciaMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_ordenSecuenciaMeta);
    }
    if (data.containsKey('activo')) {
      context.handle(
        _activoMeta,
        activo.isAcceptableOrUnknown(data['activo']!, _activoMeta),
      );
    }
    if (data.containsKey('fecha_captura')) {
      context.handle(
        _fechaCapturaMeta,
        fechaCaptura.isAcceptableOrUnknown(
          data['fecha_captura']!,
          _fechaCapturaMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {idCoordenada};
  @override
  LoteCoordenada map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LoteCoordenada(
      idCoordenada: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_coordenada'],
      )!,
      idLote: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id_lote'],
      )!,
      latitud: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}latitud'],
      )!,
      longitud: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}longitud'],
      )!,
      altitud: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}altitud'],
      ),
      precisionGPS: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}precision_g_p_s'],
      ),
      ordenSecuencia: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}orden_secuencia'],
      )!,
      activo: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}activo'],
      )!,
      fechaCaptura: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}fecha_captura'],
      ),
    );
  }

  @override
  $LoteCoordenadasTable createAlias(String alias) {
    return $LoteCoordenadasTable(attachedDatabase, alias);
  }
}

class LoteCoordenada extends DataClass implements Insertable<LoteCoordenada> {
  final String idCoordenada;
  final String idLote;
  final double latitud;
  final double longitud;
  final double? altitud;
  final double? precisionGPS;
  final int ordenSecuencia;
  final bool activo;
  final DateTime? fechaCaptura;
  const LoteCoordenada({
    required this.idCoordenada,
    required this.idLote,
    required this.latitud,
    required this.longitud,
    this.altitud,
    this.precisionGPS,
    required this.ordenSecuencia,
    required this.activo,
    this.fechaCaptura,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id_coordenada'] = Variable<String>(idCoordenada);
    map['id_lote'] = Variable<String>(idLote);
    map['latitud'] = Variable<double>(latitud);
    map['longitud'] = Variable<double>(longitud);
    if (!nullToAbsent || altitud != null) {
      map['altitud'] = Variable<double>(altitud);
    }
    if (!nullToAbsent || precisionGPS != null) {
      map['precision_g_p_s'] = Variable<double>(precisionGPS);
    }
    map['orden_secuencia'] = Variable<int>(ordenSecuencia);
    map['activo'] = Variable<bool>(activo);
    if (!nullToAbsent || fechaCaptura != null) {
      map['fecha_captura'] = Variable<DateTime>(fechaCaptura);
    }
    return map;
  }

  LoteCoordenadasCompanion toCompanion(bool nullToAbsent) {
    return LoteCoordenadasCompanion(
      idCoordenada: Value(idCoordenada),
      idLote: Value(idLote),
      latitud: Value(latitud),
      longitud: Value(longitud),
      altitud: altitud == null && nullToAbsent
          ? const Value.absent()
          : Value(altitud),
      precisionGPS: precisionGPS == null && nullToAbsent
          ? const Value.absent()
          : Value(precisionGPS),
      ordenSecuencia: Value(ordenSecuencia),
      activo: Value(activo),
      fechaCaptura: fechaCaptura == null && nullToAbsent
          ? const Value.absent()
          : Value(fechaCaptura),
    );
  }

  factory LoteCoordenada.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LoteCoordenada(
      idCoordenada: serializer.fromJson<String>(json['idCoordenada']),
      idLote: serializer.fromJson<String>(json['idLote']),
      latitud: serializer.fromJson<double>(json['latitud']),
      longitud: serializer.fromJson<double>(json['longitud']),
      altitud: serializer.fromJson<double?>(json['altitud']),
      precisionGPS: serializer.fromJson<double?>(json['precisionGPS']),
      ordenSecuencia: serializer.fromJson<int>(json['ordenSecuencia']),
      activo: serializer.fromJson<bool>(json['activo']),
      fechaCaptura: serializer.fromJson<DateTime?>(json['fechaCaptura']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'idCoordenada': serializer.toJson<String>(idCoordenada),
      'idLote': serializer.toJson<String>(idLote),
      'latitud': serializer.toJson<double>(latitud),
      'longitud': serializer.toJson<double>(longitud),
      'altitud': serializer.toJson<double?>(altitud),
      'precisionGPS': serializer.toJson<double?>(precisionGPS),
      'ordenSecuencia': serializer.toJson<int>(ordenSecuencia),
      'activo': serializer.toJson<bool>(activo),
      'fechaCaptura': serializer.toJson<DateTime?>(fechaCaptura),
    };
  }

  LoteCoordenada copyWith({
    String? idCoordenada,
    String? idLote,
    double? latitud,
    double? longitud,
    Value<double?> altitud = const Value.absent(),
    Value<double?> precisionGPS = const Value.absent(),
    int? ordenSecuencia,
    bool? activo,
    Value<DateTime?> fechaCaptura = const Value.absent(),
  }) => LoteCoordenada(
    idCoordenada: idCoordenada ?? this.idCoordenada,
    idLote: idLote ?? this.idLote,
    latitud: latitud ?? this.latitud,
    longitud: longitud ?? this.longitud,
    altitud: altitud.present ? altitud.value : this.altitud,
    precisionGPS: precisionGPS.present ? precisionGPS.value : this.precisionGPS,
    ordenSecuencia: ordenSecuencia ?? this.ordenSecuencia,
    activo: activo ?? this.activo,
    fechaCaptura: fechaCaptura.present ? fechaCaptura.value : this.fechaCaptura,
  );
  LoteCoordenada copyWithCompanion(LoteCoordenadasCompanion data) {
    return LoteCoordenada(
      idCoordenada: data.idCoordenada.present
          ? data.idCoordenada.value
          : this.idCoordenada,
      idLote: data.idLote.present ? data.idLote.value : this.idLote,
      latitud: data.latitud.present ? data.latitud.value : this.latitud,
      longitud: data.longitud.present ? data.longitud.value : this.longitud,
      altitud: data.altitud.present ? data.altitud.value : this.altitud,
      precisionGPS: data.precisionGPS.present
          ? data.precisionGPS.value
          : this.precisionGPS,
      ordenSecuencia: data.ordenSecuencia.present
          ? data.ordenSecuencia.value
          : this.ordenSecuencia,
      activo: data.activo.present ? data.activo.value : this.activo,
      fechaCaptura: data.fechaCaptura.present
          ? data.fechaCaptura.value
          : this.fechaCaptura,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LoteCoordenada(')
          ..write('idCoordenada: $idCoordenada, ')
          ..write('idLote: $idLote, ')
          ..write('latitud: $latitud, ')
          ..write('longitud: $longitud, ')
          ..write('altitud: $altitud, ')
          ..write('precisionGPS: $precisionGPS, ')
          ..write('ordenSecuencia: $ordenSecuencia, ')
          ..write('activo: $activo, ')
          ..write('fechaCaptura: $fechaCaptura')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    idCoordenada,
    idLote,
    latitud,
    longitud,
    altitud,
    precisionGPS,
    ordenSecuencia,
    activo,
    fechaCaptura,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LoteCoordenada &&
          other.idCoordenada == this.idCoordenada &&
          other.idLote == this.idLote &&
          other.latitud == this.latitud &&
          other.longitud == this.longitud &&
          other.altitud == this.altitud &&
          other.precisionGPS == this.precisionGPS &&
          other.ordenSecuencia == this.ordenSecuencia &&
          other.activo == this.activo &&
          other.fechaCaptura == this.fechaCaptura);
}

class LoteCoordenadasCompanion extends UpdateCompanion<LoteCoordenada> {
  final Value<String> idCoordenada;
  final Value<String> idLote;
  final Value<double> latitud;
  final Value<double> longitud;
  final Value<double?> altitud;
  final Value<double?> precisionGPS;
  final Value<int> ordenSecuencia;
  final Value<bool> activo;
  final Value<DateTime?> fechaCaptura;
  final Value<int> rowid;
  const LoteCoordenadasCompanion({
    this.idCoordenada = const Value.absent(),
    this.idLote = const Value.absent(),
    this.latitud = const Value.absent(),
    this.longitud = const Value.absent(),
    this.altitud = const Value.absent(),
    this.precisionGPS = const Value.absent(),
    this.ordenSecuencia = const Value.absent(),
    this.activo = const Value.absent(),
    this.fechaCaptura = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  LoteCoordenadasCompanion.insert({
    required String idCoordenada,
    required String idLote,
    required double latitud,
    required double longitud,
    this.altitud = const Value.absent(),
    this.precisionGPS = const Value.absent(),
    required int ordenSecuencia,
    this.activo = const Value.absent(),
    this.fechaCaptura = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : idCoordenada = Value(idCoordenada),
       idLote = Value(idLote),
       latitud = Value(latitud),
       longitud = Value(longitud),
       ordenSecuencia = Value(ordenSecuencia);
  static Insertable<LoteCoordenada> custom({
    Expression<String>? idCoordenada,
    Expression<String>? idLote,
    Expression<double>? latitud,
    Expression<double>? longitud,
    Expression<double>? altitud,
    Expression<double>? precisionGPS,
    Expression<int>? ordenSecuencia,
    Expression<bool>? activo,
    Expression<DateTime>? fechaCaptura,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (idCoordenada != null) 'id_coordenada': idCoordenada,
      if (idLote != null) 'id_lote': idLote,
      if (latitud != null) 'latitud': latitud,
      if (longitud != null) 'longitud': longitud,
      if (altitud != null) 'altitud': altitud,
      if (precisionGPS != null) 'precision_g_p_s': precisionGPS,
      if (ordenSecuencia != null) 'orden_secuencia': ordenSecuencia,
      if (activo != null) 'activo': activo,
      if (fechaCaptura != null) 'fecha_captura': fechaCaptura,
      if (rowid != null) 'rowid': rowid,
    });
  }

  LoteCoordenadasCompanion copyWith({
    Value<String>? idCoordenada,
    Value<String>? idLote,
    Value<double>? latitud,
    Value<double>? longitud,
    Value<double?>? altitud,
    Value<double?>? precisionGPS,
    Value<int>? ordenSecuencia,
    Value<bool>? activo,
    Value<DateTime?>? fechaCaptura,
    Value<int>? rowid,
  }) {
    return LoteCoordenadasCompanion(
      idCoordenada: idCoordenada ?? this.idCoordenada,
      idLote: idLote ?? this.idLote,
      latitud: latitud ?? this.latitud,
      longitud: longitud ?? this.longitud,
      altitud: altitud ?? this.altitud,
      precisionGPS: precisionGPS ?? this.precisionGPS,
      ordenSecuencia: ordenSecuencia ?? this.ordenSecuencia,
      activo: activo ?? this.activo,
      fechaCaptura: fechaCaptura ?? this.fechaCaptura,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (idCoordenada.present) {
      map['id_coordenada'] = Variable<String>(idCoordenada.value);
    }
    if (idLote.present) {
      map['id_lote'] = Variable<String>(idLote.value);
    }
    if (latitud.present) {
      map['latitud'] = Variable<double>(latitud.value);
    }
    if (longitud.present) {
      map['longitud'] = Variable<double>(longitud.value);
    }
    if (altitud.present) {
      map['altitud'] = Variable<double>(altitud.value);
    }
    if (precisionGPS.present) {
      map['precision_g_p_s'] = Variable<double>(precisionGPS.value);
    }
    if (ordenSecuencia.present) {
      map['orden_secuencia'] = Variable<int>(ordenSecuencia.value);
    }
    if (activo.present) {
      map['activo'] = Variable<bool>(activo.value);
    }
    if (fechaCaptura.present) {
      map['fecha_captura'] = Variable<DateTime>(fechaCaptura.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LoteCoordenadasCompanion(')
          ..write('idCoordenada: $idCoordenada, ')
          ..write('idLote: $idLote, ')
          ..write('latitud: $latitud, ')
          ..write('longitud: $longitud, ')
          ..write('altitud: $altitud, ')
          ..write('precisionGPS: $precisionGPS, ')
          ..write('ordenSecuencia: $ordenSecuencia, ')
          ..write('activo: $activo, ')
          ..write('fechaCaptura: $fechaCaptura, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $RolesTable roles = $RolesTable(this);
  late final $UsuariosTable usuarios = $UsuariosTable(this);
  late final $EstatusProspeccionesTable estatusProspecciones =
      $EstatusProspeccionesTable(this);
  late final $ProspeccionLotesTable prospeccionLotes = $ProspeccionLotesTable(
    this,
  );
  late final $LoteCoordenadasTable loteCoordenadas = $LoteCoordenadasTable(
    this,
  );
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    roles,
    usuarios,
    estatusProspecciones,
    prospeccionLotes,
    loteCoordenadas,
  ];
}

typedef $$RolesTableCreateCompanionBuilder =
    RolesCompanion Function({
      required String idRol,
      required String nombre,
      Value<String?> descripcion,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });
typedef $$RolesTableUpdateCompanionBuilder =
    RolesCompanion Function({
      Value<String> idRol,
      Value<String> nombre,
      Value<String?> descripcion,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });

final class $$RolesTableReferences
    extends BaseReferences<_$AppDatabase, $RolesTable, Role> {
  $$RolesTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$UsuariosTable, List<Usuario>> _usuariosRefsTable(
    _$AppDatabase db,
  ) => MultiTypedResultKey.fromTable(
    db.usuarios,
    aliasName: $_aliasNameGenerator(db.roles.idRol, db.usuarios.idRol),
  );

  $$UsuariosTableProcessedTableManager get usuariosRefs {
    final manager = $$UsuariosTableTableManager(
      $_db,
      $_db.usuarios,
    ).filter((f) => f.idRol.idRol.sqlEquals($_itemColumn<String>('id_rol')!));

    final cache = $_typedResult.readTableOrNull(_usuariosRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$RolesTableFilterComposer extends Composer<_$AppDatabase, $RolesTable> {
  $$RolesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get idRol => $composableBuilder(
    column: $table.idRol,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nombre => $composableBuilder(
    column: $table.nombre,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> usuariosRefs(
    Expression<bool> Function($$UsuariosTableFilterComposer f) f,
  ) {
    final $$UsuariosTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idRol,
      referencedTable: $db.usuarios,
      getReferencedColumn: (t) => t.idRol,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$UsuariosTableFilterComposer(
            $db: $db,
            $table: $db.usuarios,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$RolesTableOrderingComposer
    extends Composer<_$AppDatabase, $RolesTable> {
  $$RolesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get idRol => $composableBuilder(
    column: $table.idRol,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nombre => $composableBuilder(
    column: $table.nombre,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$RolesTableAnnotationComposer
    extends Composer<_$AppDatabase, $RolesTable> {
  $$RolesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get idRol =>
      $composableBuilder(column: $table.idRol, builder: (column) => column);

  GeneratedColumn<String> get nombre =>
      $composableBuilder(column: $table.nombre, builder: (column) => column);

  GeneratedColumn<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get activo =>
      $composableBuilder(column: $table.activo, builder: (column) => column);

  GeneratedColumn<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => column,
  );

  Expression<T> usuariosRefs<T extends Object>(
    Expression<T> Function($$UsuariosTableAnnotationComposer a) f,
  ) {
    final $$UsuariosTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idRol,
      referencedTable: $db.usuarios,
      getReferencedColumn: (t) => t.idRol,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$UsuariosTableAnnotationComposer(
            $db: $db,
            $table: $db.usuarios,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$RolesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $RolesTable,
          Role,
          $$RolesTableFilterComposer,
          $$RolesTableOrderingComposer,
          $$RolesTableAnnotationComposer,
          $$RolesTableCreateCompanionBuilder,
          $$RolesTableUpdateCompanionBuilder,
          (Role, $$RolesTableReferences),
          Role,
          PrefetchHooks Function({bool usuariosRefs})
        > {
  $$RolesTableTableManager(_$AppDatabase db, $RolesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$RolesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$RolesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$RolesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> idRol = const Value.absent(),
                Value<String> nombre = const Value.absent(),
                Value<String?> descripcion = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => RolesCompanion(
                idRol: idRol,
                nombre: nombre,
                descripcion: descripcion,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String idRol,
                required String nombre,
                Value<String?> descripcion = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => RolesCompanion.insert(
                idRol: idRol,
                nombre: nombre,
                descripcion: descripcion,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) =>
                    (e.readTable(table), $$RolesTableReferences(db, table, e)),
              )
              .toList(),
          prefetchHooksCallback: ({usuariosRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [if (usuariosRefs) db.usuarios],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (usuariosRefs)
                    await $_getPrefetchedData<Role, $RolesTable, Usuario>(
                      currentTable: table,
                      referencedTable: $$RolesTableReferences
                          ._usuariosRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$RolesTableReferences(db, table, p0).usuariosRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where((e) => e.idRol == item.idRol),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$RolesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $RolesTable,
      Role,
      $$RolesTableFilterComposer,
      $$RolesTableOrderingComposer,
      $$RolesTableAnnotationComposer,
      $$RolesTableCreateCompanionBuilder,
      $$RolesTableUpdateCompanionBuilder,
      (Role, $$RolesTableReferences),
      Role,
      PrefetchHooks Function({bool usuariosRefs})
    >;
typedef $$UsuariosTableCreateCompanionBuilder =
    UsuariosCompanion Function({
      required String idUsuario,
      required String idRol,
      required String nombres,
      required String apellidoPaterno,
      required String apellidoMaterno,
      required String correoElectronico,
      required String nombreUsuario,
      required String contrasenaHash,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });
typedef $$UsuariosTableUpdateCompanionBuilder =
    UsuariosCompanion Function({
      Value<String> idUsuario,
      Value<String> idRol,
      Value<String> nombres,
      Value<String> apellidoPaterno,
      Value<String> apellidoMaterno,
      Value<String> correoElectronico,
      Value<String> nombreUsuario,
      Value<String> contrasenaHash,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });

final class $$UsuariosTableReferences
    extends BaseReferences<_$AppDatabase, $UsuariosTable, Usuario> {
  $$UsuariosTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $RolesTable _idRolTable(_$AppDatabase db) => db.roles.createAlias(
    $_aliasNameGenerator(db.usuarios.idRol, db.roles.idRol),
  );

  $$RolesTableProcessedTableManager get idRol {
    final $_column = $_itemColumn<String>('id_rol')!;

    final manager = $$RolesTableTableManager(
      $_db,
      $_db.roles,
    ).filter((f) => f.idRol.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_idRolTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static MultiTypedResultKey<$ProspeccionLotesTable, List<ProspeccionLote>>
  _prospeccionLotesRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.prospeccionLotes,
    aliasName: $_aliasNameGenerator(
      db.usuarios.idUsuario,
      db.prospeccionLotes.idResponsable,
    ),
  );

  $$ProspeccionLotesTableProcessedTableManager get prospeccionLotesRefs {
    final manager =
        $$ProspeccionLotesTableTableManager($_db, $_db.prospeccionLotes).filter(
          (f) => f.idResponsable.idUsuario.sqlEquals(
            $_itemColumn<String>('id_usuario')!,
          ),
        );

    final cache = $_typedResult.readTableOrNull(
      _prospeccionLotesRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$UsuariosTableFilterComposer
    extends Composer<_$AppDatabase, $UsuariosTable> {
  $$UsuariosTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get idUsuario => $composableBuilder(
    column: $table.idUsuario,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nombres => $composableBuilder(
    column: $table.nombres,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get apellidoPaterno => $composableBuilder(
    column: $table.apellidoPaterno,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get apellidoMaterno => $composableBuilder(
    column: $table.apellidoMaterno,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get correoElectronico => $composableBuilder(
    column: $table.correoElectronico,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nombreUsuario => $composableBuilder(
    column: $table.nombreUsuario,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get contrasenaHash => $composableBuilder(
    column: $table.contrasenaHash,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnFilters(column),
  );

  $$RolesTableFilterComposer get idRol {
    final $$RolesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idRol,
      referencedTable: $db.roles,
      getReferencedColumn: (t) => t.idRol,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RolesTableFilterComposer(
            $db: $db,
            $table: $db.roles,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<bool> prospeccionLotesRefs(
    Expression<bool> Function($$ProspeccionLotesTableFilterComposer f) f,
  ) {
    final $$ProspeccionLotesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idUsuario,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idResponsable,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableFilterComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$UsuariosTableOrderingComposer
    extends Composer<_$AppDatabase, $UsuariosTable> {
  $$UsuariosTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get idUsuario => $composableBuilder(
    column: $table.idUsuario,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nombres => $composableBuilder(
    column: $table.nombres,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get apellidoPaterno => $composableBuilder(
    column: $table.apellidoPaterno,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get apellidoMaterno => $composableBuilder(
    column: $table.apellidoMaterno,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get correoElectronico => $composableBuilder(
    column: $table.correoElectronico,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nombreUsuario => $composableBuilder(
    column: $table.nombreUsuario,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get contrasenaHash => $composableBuilder(
    column: $table.contrasenaHash,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnOrderings(column),
  );

  $$RolesTableOrderingComposer get idRol {
    final $$RolesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idRol,
      referencedTable: $db.roles,
      getReferencedColumn: (t) => t.idRol,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RolesTableOrderingComposer(
            $db: $db,
            $table: $db.roles,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$UsuariosTableAnnotationComposer
    extends Composer<_$AppDatabase, $UsuariosTable> {
  $$UsuariosTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get idUsuario =>
      $composableBuilder(column: $table.idUsuario, builder: (column) => column);

  GeneratedColumn<String> get nombres =>
      $composableBuilder(column: $table.nombres, builder: (column) => column);

  GeneratedColumn<String> get apellidoPaterno => $composableBuilder(
    column: $table.apellidoPaterno,
    builder: (column) => column,
  );

  GeneratedColumn<String> get apellidoMaterno => $composableBuilder(
    column: $table.apellidoMaterno,
    builder: (column) => column,
  );

  GeneratedColumn<String> get correoElectronico => $composableBuilder(
    column: $table.correoElectronico,
    builder: (column) => column,
  );

  GeneratedColumn<String> get nombreUsuario => $composableBuilder(
    column: $table.nombreUsuario,
    builder: (column) => column,
  );

  GeneratedColumn<String> get contrasenaHash => $composableBuilder(
    column: $table.contrasenaHash,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get activo =>
      $composableBuilder(column: $table.activo, builder: (column) => column);

  GeneratedColumn<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => column,
  );

  $$RolesTableAnnotationComposer get idRol {
    final $$RolesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idRol,
      referencedTable: $db.roles,
      getReferencedColumn: (t) => t.idRol,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RolesTableAnnotationComposer(
            $db: $db,
            $table: $db.roles,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<T> prospeccionLotesRefs<T extends Object>(
    Expression<T> Function($$ProspeccionLotesTableAnnotationComposer a) f,
  ) {
    final $$ProspeccionLotesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idUsuario,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idResponsable,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableAnnotationComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$UsuariosTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $UsuariosTable,
          Usuario,
          $$UsuariosTableFilterComposer,
          $$UsuariosTableOrderingComposer,
          $$UsuariosTableAnnotationComposer,
          $$UsuariosTableCreateCompanionBuilder,
          $$UsuariosTableUpdateCompanionBuilder,
          (Usuario, $$UsuariosTableReferences),
          Usuario,
          PrefetchHooks Function({bool idRol, bool prospeccionLotesRefs})
        > {
  $$UsuariosTableTableManager(_$AppDatabase db, $UsuariosTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$UsuariosTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$UsuariosTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$UsuariosTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> idUsuario = const Value.absent(),
                Value<String> idRol = const Value.absent(),
                Value<String> nombres = const Value.absent(),
                Value<String> apellidoPaterno = const Value.absent(),
                Value<String> apellidoMaterno = const Value.absent(),
                Value<String> correoElectronico = const Value.absent(),
                Value<String> nombreUsuario = const Value.absent(),
                Value<String> contrasenaHash = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => UsuariosCompanion(
                idUsuario: idUsuario,
                idRol: idRol,
                nombres: nombres,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                correoElectronico: correoElectronico,
                nombreUsuario: nombreUsuario,
                contrasenaHash: contrasenaHash,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String idUsuario,
                required String idRol,
                required String nombres,
                required String apellidoPaterno,
                required String apellidoMaterno,
                required String correoElectronico,
                required String nombreUsuario,
                required String contrasenaHash,
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => UsuariosCompanion.insert(
                idUsuario: idUsuario,
                idRol: idRol,
                nombres: nombres,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                correoElectronico: correoElectronico,
                nombreUsuario: nombreUsuario,
                contrasenaHash: contrasenaHash,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$UsuariosTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({idRol = false, prospeccionLotesRefs = false}) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (prospeccionLotesRefs) db.prospeccionLotes,
                  ],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (idRol) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.idRol,
                                    referencedTable: $$UsuariosTableReferences
                                        ._idRolTable(db),
                                    referencedColumn: $$UsuariosTableReferences
                                        ._idRolTable(db)
                                        .idRol,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (prospeccionLotesRefs)
                        await $_getPrefetchedData<
                          Usuario,
                          $UsuariosTable,
                          ProspeccionLote
                        >(
                          currentTable: table,
                          referencedTable: $$UsuariosTableReferences
                              ._prospeccionLotesRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$UsuariosTableReferences(
                                db,
                                table,
                                p0,
                              ).prospeccionLotesRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.idResponsable == item.idUsuario,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$UsuariosTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $UsuariosTable,
      Usuario,
      $$UsuariosTableFilterComposer,
      $$UsuariosTableOrderingComposer,
      $$UsuariosTableAnnotationComposer,
      $$UsuariosTableCreateCompanionBuilder,
      $$UsuariosTableUpdateCompanionBuilder,
      (Usuario, $$UsuariosTableReferences),
      Usuario,
      PrefetchHooks Function({bool idRol, bool prospeccionLotesRefs})
    >;
typedef $$EstatusProspeccionesTableCreateCompanionBuilder =
    EstatusProspeccionesCompanion Function({
      required String idEstatusProspeccion,
      required String descripcion,
      Value<bool> activo,
      Value<int> rowid,
    });
typedef $$EstatusProspeccionesTableUpdateCompanionBuilder =
    EstatusProspeccionesCompanion Function({
      Value<String> idEstatusProspeccion,
      Value<String> descripcion,
      Value<bool> activo,
      Value<int> rowid,
    });

final class $$EstatusProspeccionesTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $EstatusProspeccionesTable,
          EstatusProspeccione
        > {
  $$EstatusProspeccionesTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<$ProspeccionLotesTable, List<ProspeccionLote>>
  _prospeccionLotesRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.prospeccionLotes,
    aliasName: $_aliasNameGenerator(
      db.estatusProspecciones.idEstatusProspeccion,
      db.prospeccionLotes.idEstatusProspeccion,
    ),
  );

  $$ProspeccionLotesTableProcessedTableManager get prospeccionLotesRefs {
    final manager =
        $$ProspeccionLotesTableTableManager($_db, $_db.prospeccionLotes).filter(
          (f) => f.idEstatusProspeccion.idEstatusProspeccion.sqlEquals(
            $_itemColumn<String>('id_estatus_prospeccion')!,
          ),
        );

    final cache = $_typedResult.readTableOrNull(
      _prospeccionLotesRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$EstatusProspeccionesTableFilterComposer
    extends Composer<_$AppDatabase, $EstatusProspeccionesTable> {
  $$EstatusProspeccionesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get idEstatusProspeccion => $composableBuilder(
    column: $table.idEstatusProspeccion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> prospeccionLotesRefs(
    Expression<bool> Function($$ProspeccionLotesTableFilterComposer f) f,
  ) {
    final $$ProspeccionLotesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idEstatusProspeccion,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idEstatusProspeccion,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableFilterComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$EstatusProspeccionesTableOrderingComposer
    extends Composer<_$AppDatabase, $EstatusProspeccionesTable> {
  $$EstatusProspeccionesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get idEstatusProspeccion => $composableBuilder(
    column: $table.idEstatusProspeccion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$EstatusProspeccionesTableAnnotationComposer
    extends Composer<_$AppDatabase, $EstatusProspeccionesTable> {
  $$EstatusProspeccionesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get idEstatusProspeccion => $composableBuilder(
    column: $table.idEstatusProspeccion,
    builder: (column) => column,
  );

  GeneratedColumn<String> get descripcion => $composableBuilder(
    column: $table.descripcion,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get activo =>
      $composableBuilder(column: $table.activo, builder: (column) => column);

  Expression<T> prospeccionLotesRefs<T extends Object>(
    Expression<T> Function($$ProspeccionLotesTableAnnotationComposer a) f,
  ) {
    final $$ProspeccionLotesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idEstatusProspeccion,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idEstatusProspeccion,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableAnnotationComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$EstatusProspeccionesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $EstatusProspeccionesTable,
          EstatusProspeccione,
          $$EstatusProspeccionesTableFilterComposer,
          $$EstatusProspeccionesTableOrderingComposer,
          $$EstatusProspeccionesTableAnnotationComposer,
          $$EstatusProspeccionesTableCreateCompanionBuilder,
          $$EstatusProspeccionesTableUpdateCompanionBuilder,
          (EstatusProspeccione, $$EstatusProspeccionesTableReferences),
          EstatusProspeccione,
          PrefetchHooks Function({bool prospeccionLotesRefs})
        > {
  $$EstatusProspeccionesTableTableManager(
    _$AppDatabase db,
    $EstatusProspeccionesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$EstatusProspeccionesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$EstatusProspeccionesTableOrderingComposer(
                $db: db,
                $table: table,
              ),
          createComputedFieldComposer: () =>
              $$EstatusProspeccionesTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> idEstatusProspeccion = const Value.absent(),
                Value<String> descripcion = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EstatusProspeccionesCompanion(
                idEstatusProspeccion: idEstatusProspeccion,
                descripcion: descripcion,
                activo: activo,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String idEstatusProspeccion,
                required String descripcion,
                Value<bool> activo = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EstatusProspeccionesCompanion.insert(
                idEstatusProspeccion: idEstatusProspeccion,
                descripcion: descripcion,
                activo: activo,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$EstatusProspeccionesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({prospeccionLotesRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (prospeccionLotesRefs) db.prospeccionLotes,
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (prospeccionLotesRefs)
                    await $_getPrefetchedData<
                      EstatusProspeccione,
                      $EstatusProspeccionesTable,
                      ProspeccionLote
                    >(
                      currentTable: table,
                      referencedTable: $$EstatusProspeccionesTableReferences
                          ._prospeccionLotesRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$EstatusProspeccionesTableReferences(
                            db,
                            table,
                            p0,
                          ).prospeccionLotesRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where(
                            (e) =>
                                e.idEstatusProspeccion ==
                                item.idEstatusProspeccion,
                          ),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$EstatusProspeccionesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $EstatusProspeccionesTable,
      EstatusProspeccione,
      $$EstatusProspeccionesTableFilterComposer,
      $$EstatusProspeccionesTableOrderingComposer,
      $$EstatusProspeccionesTableAnnotationComposer,
      $$EstatusProspeccionesTableCreateCompanionBuilder,
      $$EstatusProspeccionesTableUpdateCompanionBuilder,
      (EstatusProspeccione, $$EstatusProspeccionesTableReferences),
      EstatusProspeccione,
      PrefetchHooks Function({bool prospeccionLotesRefs})
    >;
typedef $$ProspeccionLotesTableCreateCompanionBuilder =
    ProspeccionLotesCompanion Function({
      required String idLote,
      required String idEstatusProspeccion,
      required String idResponsable,
      required String idMina,
      required String nombreAlias,
      required DateTime fechaRegistro,
      Value<DateTime?> fechaMuestreo,
      Value<String?> metodoMuestreo,
      Value<double?> leyEstimada,
      Value<double?> tonelajeEstimado,
      Value<String?> observaciones,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });
typedef $$ProspeccionLotesTableUpdateCompanionBuilder =
    ProspeccionLotesCompanion Function({
      Value<String> idLote,
      Value<String> idEstatusProspeccion,
      Value<String> idResponsable,
      Value<String> idMina,
      Value<String> nombreAlias,
      Value<DateTime> fechaRegistro,
      Value<DateTime?> fechaMuestreo,
      Value<String?> metodoMuestreo,
      Value<double?> leyEstimada,
      Value<double?> tonelajeEstimado,
      Value<String?> observaciones,
      Value<bool> activo,
      Value<DateTime?> fechaCreacion,
      Value<DateTime?> fechaActualizacion,
      Value<int> rowid,
    });

final class $$ProspeccionLotesTableReferences
    extends
        BaseReferences<_$AppDatabase, $ProspeccionLotesTable, ProspeccionLote> {
  $$ProspeccionLotesTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $EstatusProspeccionesTable _idEstatusProspeccionTable(
    _$AppDatabase db,
  ) => db.estatusProspecciones.createAlias(
    $_aliasNameGenerator(
      db.prospeccionLotes.idEstatusProspeccion,
      db.estatusProspecciones.idEstatusProspeccion,
    ),
  );

  $$EstatusProspeccionesTableProcessedTableManager get idEstatusProspeccion {
    final $_column = $_itemColumn<String>('id_estatus_prospeccion')!;

    final manager = $$EstatusProspeccionesTableTableManager(
      $_db,
      $_db.estatusProspecciones,
    ).filter((f) => f.idEstatusProspeccion.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(
      _idEstatusProspeccionTable($_db),
    );
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $UsuariosTable _idResponsableTable(_$AppDatabase db) =>
      db.usuarios.createAlias(
        $_aliasNameGenerator(
          db.prospeccionLotes.idResponsable,
          db.usuarios.idUsuario,
        ),
      );

  $$UsuariosTableProcessedTableManager get idResponsable {
    final $_column = $_itemColumn<String>('id_responsable')!;

    final manager = $$UsuariosTableTableManager(
      $_db,
      $_db.usuarios,
    ).filter((f) => f.idUsuario.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_idResponsableTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static MultiTypedResultKey<$LoteCoordenadasTable, List<LoteCoordenada>>
  _loteCoordenadasRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.loteCoordenadas,
    aliasName: $_aliasNameGenerator(
      db.prospeccionLotes.idLote,
      db.loteCoordenadas.idLote,
    ),
  );

  $$LoteCoordenadasTableProcessedTableManager get loteCoordenadasRefs {
    final manager =
        $$LoteCoordenadasTableTableManager($_db, $_db.loteCoordenadas).filter(
          (f) => f.idLote.idLote.sqlEquals($_itemColumn<String>('id_lote')!),
        );

    final cache = $_typedResult.readTableOrNull(
      _loteCoordenadasRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$ProspeccionLotesTableFilterComposer
    extends Composer<_$AppDatabase, $ProspeccionLotesTable> {
  $$ProspeccionLotesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get idLote => $composableBuilder(
    column: $table.idLote,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get idMina => $composableBuilder(
    column: $table.idMina,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nombreAlias => $composableBuilder(
    column: $table.nombreAlias,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaRegistro => $composableBuilder(
    column: $table.fechaRegistro,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaMuestreo => $composableBuilder(
    column: $table.fechaMuestreo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get metodoMuestreo => $composableBuilder(
    column: $table.metodoMuestreo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get leyEstimada => $composableBuilder(
    column: $table.leyEstimada,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get tonelajeEstimado => $composableBuilder(
    column: $table.tonelajeEstimado,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get observaciones => $composableBuilder(
    column: $table.observaciones,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnFilters(column),
  );

  $$EstatusProspeccionesTableFilterComposer get idEstatusProspeccion {
    final $$EstatusProspeccionesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idEstatusProspeccion,
      referencedTable: $db.estatusProspecciones,
      getReferencedColumn: (t) => t.idEstatusProspeccion,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EstatusProspeccionesTableFilterComposer(
            $db: $db,
            $table: $db.estatusProspecciones,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$UsuariosTableFilterComposer get idResponsable {
    final $$UsuariosTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idResponsable,
      referencedTable: $db.usuarios,
      getReferencedColumn: (t) => t.idUsuario,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$UsuariosTableFilterComposer(
            $db: $db,
            $table: $db.usuarios,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<bool> loteCoordenadasRefs(
    Expression<bool> Function($$LoteCoordenadasTableFilterComposer f) f,
  ) {
    final $$LoteCoordenadasTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idLote,
      referencedTable: $db.loteCoordenadas,
      getReferencedColumn: (t) => t.idLote,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$LoteCoordenadasTableFilterComposer(
            $db: $db,
            $table: $db.loteCoordenadas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$ProspeccionLotesTableOrderingComposer
    extends Composer<_$AppDatabase, $ProspeccionLotesTable> {
  $$ProspeccionLotesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get idLote => $composableBuilder(
    column: $table.idLote,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get idMina => $composableBuilder(
    column: $table.idMina,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nombreAlias => $composableBuilder(
    column: $table.nombreAlias,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaRegistro => $composableBuilder(
    column: $table.fechaRegistro,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaMuestreo => $composableBuilder(
    column: $table.fechaMuestreo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get metodoMuestreo => $composableBuilder(
    column: $table.metodoMuestreo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get leyEstimada => $composableBuilder(
    column: $table.leyEstimada,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get tonelajeEstimado => $composableBuilder(
    column: $table.tonelajeEstimado,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get observaciones => $composableBuilder(
    column: $table.observaciones,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => ColumnOrderings(column),
  );

  $$EstatusProspeccionesTableOrderingComposer get idEstatusProspeccion {
    final $$EstatusProspeccionesTableOrderingComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.idEstatusProspeccion,
          referencedTable: $db.estatusProspecciones,
          getReferencedColumn: (t) => t.idEstatusProspeccion,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$EstatusProspeccionesTableOrderingComposer(
                $db: $db,
                $table: $db.estatusProspecciones,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return composer;
  }

  $$UsuariosTableOrderingComposer get idResponsable {
    final $$UsuariosTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idResponsable,
      referencedTable: $db.usuarios,
      getReferencedColumn: (t) => t.idUsuario,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$UsuariosTableOrderingComposer(
            $db: $db,
            $table: $db.usuarios,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$ProspeccionLotesTableAnnotationComposer
    extends Composer<_$AppDatabase, $ProspeccionLotesTable> {
  $$ProspeccionLotesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get idLote =>
      $composableBuilder(column: $table.idLote, builder: (column) => column);

  GeneratedColumn<String> get idMina =>
      $composableBuilder(column: $table.idMina, builder: (column) => column);

  GeneratedColumn<String> get nombreAlias => $composableBuilder(
    column: $table.nombreAlias,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get fechaRegistro => $composableBuilder(
    column: $table.fechaRegistro,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get fechaMuestreo => $composableBuilder(
    column: $table.fechaMuestreo,
    builder: (column) => column,
  );

  GeneratedColumn<String> get metodoMuestreo => $composableBuilder(
    column: $table.metodoMuestreo,
    builder: (column) => column,
  );

  GeneratedColumn<double> get leyEstimada => $composableBuilder(
    column: $table.leyEstimada,
    builder: (column) => column,
  );

  GeneratedColumn<double> get tonelajeEstimado => $composableBuilder(
    column: $table.tonelajeEstimado,
    builder: (column) => column,
  );

  GeneratedColumn<String> get observaciones => $composableBuilder(
    column: $table.observaciones,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get activo =>
      $composableBuilder(column: $table.activo, builder: (column) => column);

  GeneratedColumn<DateTime> get fechaCreacion => $composableBuilder(
    column: $table.fechaCreacion,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get fechaActualizacion => $composableBuilder(
    column: $table.fechaActualizacion,
    builder: (column) => column,
  );

  $$EstatusProspeccionesTableAnnotationComposer get idEstatusProspeccion {
    final $$EstatusProspeccionesTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.idEstatusProspeccion,
          referencedTable: $db.estatusProspecciones,
          getReferencedColumn: (t) => t.idEstatusProspeccion,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$EstatusProspeccionesTableAnnotationComposer(
                $db: $db,
                $table: $db.estatusProspecciones,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return composer;
  }

  $$UsuariosTableAnnotationComposer get idResponsable {
    final $$UsuariosTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idResponsable,
      referencedTable: $db.usuarios,
      getReferencedColumn: (t) => t.idUsuario,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$UsuariosTableAnnotationComposer(
            $db: $db,
            $table: $db.usuarios,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<T> loteCoordenadasRefs<T extends Object>(
    Expression<T> Function($$LoteCoordenadasTableAnnotationComposer a) f,
  ) {
    final $$LoteCoordenadasTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idLote,
      referencedTable: $db.loteCoordenadas,
      getReferencedColumn: (t) => t.idLote,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$LoteCoordenadasTableAnnotationComposer(
            $db: $db,
            $table: $db.loteCoordenadas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$ProspeccionLotesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $ProspeccionLotesTable,
          ProspeccionLote,
          $$ProspeccionLotesTableFilterComposer,
          $$ProspeccionLotesTableOrderingComposer,
          $$ProspeccionLotesTableAnnotationComposer,
          $$ProspeccionLotesTableCreateCompanionBuilder,
          $$ProspeccionLotesTableUpdateCompanionBuilder,
          (ProspeccionLote, $$ProspeccionLotesTableReferences),
          ProspeccionLote,
          PrefetchHooks Function({
            bool idEstatusProspeccion,
            bool idResponsable,
            bool loteCoordenadasRefs,
          })
        > {
  $$ProspeccionLotesTableTableManager(
    _$AppDatabase db,
    $ProspeccionLotesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ProspeccionLotesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ProspeccionLotesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ProspeccionLotesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> idLote = const Value.absent(),
                Value<String> idEstatusProspeccion = const Value.absent(),
                Value<String> idResponsable = const Value.absent(),
                Value<String> idMina = const Value.absent(),
                Value<String> nombreAlias = const Value.absent(),
                Value<DateTime> fechaRegistro = const Value.absent(),
                Value<DateTime?> fechaMuestreo = const Value.absent(),
                Value<String?> metodoMuestreo = const Value.absent(),
                Value<double?> leyEstimada = const Value.absent(),
                Value<double?> tonelajeEstimado = const Value.absent(),
                Value<String?> observaciones = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ProspeccionLotesCompanion(
                idLote: idLote,
                idEstatusProspeccion: idEstatusProspeccion,
                idResponsable: idResponsable,
                idMina: idMina,
                nombreAlias: nombreAlias,
                fechaRegistro: fechaRegistro,
                fechaMuestreo: fechaMuestreo,
                metodoMuestreo: metodoMuestreo,
                leyEstimada: leyEstimada,
                tonelajeEstimado: tonelajeEstimado,
                observaciones: observaciones,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String idLote,
                required String idEstatusProspeccion,
                required String idResponsable,
                required String idMina,
                required String nombreAlias,
                required DateTime fechaRegistro,
                Value<DateTime?> fechaMuestreo = const Value.absent(),
                Value<String?> metodoMuestreo = const Value.absent(),
                Value<double?> leyEstimada = const Value.absent(),
                Value<double?> tonelajeEstimado = const Value.absent(),
                Value<String?> observaciones = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCreacion = const Value.absent(),
                Value<DateTime?> fechaActualizacion = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ProspeccionLotesCompanion.insert(
                idLote: idLote,
                idEstatusProspeccion: idEstatusProspeccion,
                idResponsable: idResponsable,
                idMina: idMina,
                nombreAlias: nombreAlias,
                fechaRegistro: fechaRegistro,
                fechaMuestreo: fechaMuestreo,
                metodoMuestreo: metodoMuestreo,
                leyEstimada: leyEstimada,
                tonelajeEstimado: tonelajeEstimado,
                observaciones: observaciones,
                activo: activo,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$ProspeccionLotesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({
                idEstatusProspeccion = false,
                idResponsable = false,
                loteCoordenadasRefs = false,
              }) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (loteCoordenadasRefs) db.loteCoordenadas,
                  ],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (idEstatusProspeccion) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.idEstatusProspeccion,
                                    referencedTable:
                                        $$ProspeccionLotesTableReferences
                                            ._idEstatusProspeccionTable(db),
                                    referencedColumn:
                                        $$ProspeccionLotesTableReferences
                                            ._idEstatusProspeccionTable(db)
                                            .idEstatusProspeccion,
                                  )
                                  as T;
                        }
                        if (idResponsable) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.idResponsable,
                                    referencedTable:
                                        $$ProspeccionLotesTableReferences
                                            ._idResponsableTable(db),
                                    referencedColumn:
                                        $$ProspeccionLotesTableReferences
                                            ._idResponsableTable(db)
                                            .idUsuario,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (loteCoordenadasRefs)
                        await $_getPrefetchedData<
                          ProspeccionLote,
                          $ProspeccionLotesTable,
                          LoteCoordenada
                        >(
                          currentTable: table,
                          referencedTable: $$ProspeccionLotesTableReferences
                              ._loteCoordenadasRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$ProspeccionLotesTableReferences(
                                db,
                                table,
                                p0,
                              ).loteCoordenadasRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.idLote == item.idLote,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$ProspeccionLotesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $ProspeccionLotesTable,
      ProspeccionLote,
      $$ProspeccionLotesTableFilterComposer,
      $$ProspeccionLotesTableOrderingComposer,
      $$ProspeccionLotesTableAnnotationComposer,
      $$ProspeccionLotesTableCreateCompanionBuilder,
      $$ProspeccionLotesTableUpdateCompanionBuilder,
      (ProspeccionLote, $$ProspeccionLotesTableReferences),
      ProspeccionLote,
      PrefetchHooks Function({
        bool idEstatusProspeccion,
        bool idResponsable,
        bool loteCoordenadasRefs,
      })
    >;
typedef $$LoteCoordenadasTableCreateCompanionBuilder =
    LoteCoordenadasCompanion Function({
      required String idCoordenada,
      required String idLote,
      required double latitud,
      required double longitud,
      Value<double?> altitud,
      Value<double?> precisionGPS,
      required int ordenSecuencia,
      Value<bool> activo,
      Value<DateTime?> fechaCaptura,
      Value<int> rowid,
    });
typedef $$LoteCoordenadasTableUpdateCompanionBuilder =
    LoteCoordenadasCompanion Function({
      Value<String> idCoordenada,
      Value<String> idLote,
      Value<double> latitud,
      Value<double> longitud,
      Value<double?> altitud,
      Value<double?> precisionGPS,
      Value<int> ordenSecuencia,
      Value<bool> activo,
      Value<DateTime?> fechaCaptura,
      Value<int> rowid,
    });

final class $$LoteCoordenadasTableReferences
    extends
        BaseReferences<_$AppDatabase, $LoteCoordenadasTable, LoteCoordenada> {
  $$LoteCoordenadasTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $ProspeccionLotesTable _idLoteTable(_$AppDatabase db) =>
      db.prospeccionLotes.createAlias(
        $_aliasNameGenerator(
          db.loteCoordenadas.idLote,
          db.prospeccionLotes.idLote,
        ),
      );

  $$ProspeccionLotesTableProcessedTableManager get idLote {
    final $_column = $_itemColumn<String>('id_lote')!;

    final manager = $$ProspeccionLotesTableTableManager(
      $_db,
      $_db.prospeccionLotes,
    ).filter((f) => f.idLote.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_idLoteTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$LoteCoordenadasTableFilterComposer
    extends Composer<_$AppDatabase, $LoteCoordenadasTable> {
  $$LoteCoordenadasTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get idCoordenada => $composableBuilder(
    column: $table.idCoordenada,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get latitud => $composableBuilder(
    column: $table.latitud,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get longitud => $composableBuilder(
    column: $table.longitud,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get altitud => $composableBuilder(
    column: $table.altitud,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get precisionGPS => $composableBuilder(
    column: $table.precisionGPS,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get ordenSecuencia => $composableBuilder(
    column: $table.ordenSecuencia,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get fechaCaptura => $composableBuilder(
    column: $table.fechaCaptura,
    builder: (column) => ColumnFilters(column),
  );

  $$ProspeccionLotesTableFilterComposer get idLote {
    final $$ProspeccionLotesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idLote,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idLote,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableFilterComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$LoteCoordenadasTableOrderingComposer
    extends Composer<_$AppDatabase, $LoteCoordenadasTable> {
  $$LoteCoordenadasTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get idCoordenada => $composableBuilder(
    column: $table.idCoordenada,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get latitud => $composableBuilder(
    column: $table.latitud,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get longitud => $composableBuilder(
    column: $table.longitud,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get altitud => $composableBuilder(
    column: $table.altitud,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get precisionGPS => $composableBuilder(
    column: $table.precisionGPS,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get ordenSecuencia => $composableBuilder(
    column: $table.ordenSecuencia,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get activo => $composableBuilder(
    column: $table.activo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get fechaCaptura => $composableBuilder(
    column: $table.fechaCaptura,
    builder: (column) => ColumnOrderings(column),
  );

  $$ProspeccionLotesTableOrderingComposer get idLote {
    final $$ProspeccionLotesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idLote,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idLote,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableOrderingComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$LoteCoordenadasTableAnnotationComposer
    extends Composer<_$AppDatabase, $LoteCoordenadasTable> {
  $$LoteCoordenadasTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get idCoordenada => $composableBuilder(
    column: $table.idCoordenada,
    builder: (column) => column,
  );

  GeneratedColumn<double> get latitud =>
      $composableBuilder(column: $table.latitud, builder: (column) => column);

  GeneratedColumn<double> get longitud =>
      $composableBuilder(column: $table.longitud, builder: (column) => column);

  GeneratedColumn<double> get altitud =>
      $composableBuilder(column: $table.altitud, builder: (column) => column);

  GeneratedColumn<double> get precisionGPS => $composableBuilder(
    column: $table.precisionGPS,
    builder: (column) => column,
  );

  GeneratedColumn<int> get ordenSecuencia => $composableBuilder(
    column: $table.ordenSecuencia,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get activo =>
      $composableBuilder(column: $table.activo, builder: (column) => column);

  GeneratedColumn<DateTime> get fechaCaptura => $composableBuilder(
    column: $table.fechaCaptura,
    builder: (column) => column,
  );

  $$ProspeccionLotesTableAnnotationComposer get idLote {
    final $$ProspeccionLotesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.idLote,
      referencedTable: $db.prospeccionLotes,
      getReferencedColumn: (t) => t.idLote,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ProspeccionLotesTableAnnotationComposer(
            $db: $db,
            $table: $db.prospeccionLotes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$LoteCoordenadasTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $LoteCoordenadasTable,
          LoteCoordenada,
          $$LoteCoordenadasTableFilterComposer,
          $$LoteCoordenadasTableOrderingComposer,
          $$LoteCoordenadasTableAnnotationComposer,
          $$LoteCoordenadasTableCreateCompanionBuilder,
          $$LoteCoordenadasTableUpdateCompanionBuilder,
          (LoteCoordenada, $$LoteCoordenadasTableReferences),
          LoteCoordenada,
          PrefetchHooks Function({bool idLote})
        > {
  $$LoteCoordenadasTableTableManager(
    _$AppDatabase db,
    $LoteCoordenadasTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LoteCoordenadasTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LoteCoordenadasTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LoteCoordenadasTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> idCoordenada = const Value.absent(),
                Value<String> idLote = const Value.absent(),
                Value<double> latitud = const Value.absent(),
                Value<double> longitud = const Value.absent(),
                Value<double?> altitud = const Value.absent(),
                Value<double?> precisionGPS = const Value.absent(),
                Value<int> ordenSecuencia = const Value.absent(),
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCaptura = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LoteCoordenadasCompanion(
                idCoordenada: idCoordenada,
                idLote: idLote,
                latitud: latitud,
                longitud: longitud,
                altitud: altitud,
                precisionGPS: precisionGPS,
                ordenSecuencia: ordenSecuencia,
                activo: activo,
                fechaCaptura: fechaCaptura,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String idCoordenada,
                required String idLote,
                required double latitud,
                required double longitud,
                Value<double?> altitud = const Value.absent(),
                Value<double?> precisionGPS = const Value.absent(),
                required int ordenSecuencia,
                Value<bool> activo = const Value.absent(),
                Value<DateTime?> fechaCaptura = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LoteCoordenadasCompanion.insert(
                idCoordenada: idCoordenada,
                idLote: idLote,
                latitud: latitud,
                longitud: longitud,
                altitud: altitud,
                precisionGPS: precisionGPS,
                ordenSecuencia: ordenSecuencia,
                activo: activo,
                fechaCaptura: fechaCaptura,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$LoteCoordenadasTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({idLote = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (idLote) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.idLote,
                                referencedTable:
                                    $$LoteCoordenadasTableReferences
                                        ._idLoteTable(db),
                                referencedColumn:
                                    $$LoteCoordenadasTableReferences
                                        ._idLoteTable(db)
                                        .idLote,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$LoteCoordenadasTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $LoteCoordenadasTable,
      LoteCoordenada,
      $$LoteCoordenadasTableFilterComposer,
      $$LoteCoordenadasTableOrderingComposer,
      $$LoteCoordenadasTableAnnotationComposer,
      $$LoteCoordenadasTableCreateCompanionBuilder,
      $$LoteCoordenadasTableUpdateCompanionBuilder,
      (LoteCoordenada, $$LoteCoordenadasTableReferences),
      LoteCoordenada,
      PrefetchHooks Function({bool idLote})
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$RolesTableTableManager get roles =>
      $$RolesTableTableManager(_db, _db.roles);
  $$UsuariosTableTableManager get usuarios =>
      $$UsuariosTableTableManager(_db, _db.usuarios);
  $$EstatusProspeccionesTableTableManager get estatusProspecciones =>
      $$EstatusProspeccionesTableTableManager(_db, _db.estatusProspecciones);
  $$ProspeccionLotesTableTableManager get prospeccionLotes =>
      $$ProspeccionLotesTableTableManager(_db, _db.prospeccionLotes);
  $$LoteCoordenadasTableTableManager get loteCoordenadas =>
      $$LoteCoordenadasTableTableManager(_db, _db.loteCoordenadas);
}
