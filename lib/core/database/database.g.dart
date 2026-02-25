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

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $RolesTable roles = $RolesTable(this);
  late final $UsuariosTable usuarios = $UsuariosTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [roles, usuarios];
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
          PrefetchHooks Function({bool idRol})
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
          prefetchHooksCallback: ({idRol = false}) {
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
                return [];
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
      PrefetchHooks Function({bool idRol})
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$RolesTableTableManager get roles =>
      $$RolesTableTableManager(_db, _db.roles);
  $$UsuariosTableTableManager get usuarios =>
      $$UsuariosTableTableManager(_db, _db.usuarios);
}
