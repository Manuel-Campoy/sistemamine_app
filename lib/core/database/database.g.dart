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

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $RolesTable roles = $RolesTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [roles];
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
          (Role, BaseReferences<_$AppDatabase, $RolesTable, Role>),
          Role,
          PrefetchHooks Function()
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
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
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
      (Role, BaseReferences<_$AppDatabase, $RolesTable, Role>),
      Role,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$RolesTableTableManager get roles =>
      $$RolesTableTableManager(_db, _db.roles);
}
