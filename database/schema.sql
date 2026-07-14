create database mentia

create table usuario (
    id_usuario serial primary key,
    nombre_completo varchar not null,
    correo varchar unique not null,
    contrasena varchar not null,
    fecha_registro timestamp default current_timestamp
);

create table actividad (
    id_actividad serial primary key,
    nombre_proyecto varchar not null,
    lenguaje varchar not null
        check (lenguaje in ('Python', 'Java', 'Javascript', 'HTML', 'CSS')),
    codigo text,
    archivo text,
    fecha_subida timestamp default current_timestamp,
    estado varchar not null default 'pendiente'
        check (estado in ('pendiente', 'analizando', 'completado')),
    id_usuario integer not null,

    foreign key (id_usuario)
        references usuario (id_usuario)
);

create table analisis (
    id_analisis serial primary key,
    puntaje int,
    resumen text,
    fortalezas text,
    aspectos_mejorar text,
    recomendacion text,
    fecha_analisis timestamp default current_timestamp,
    id_actividad int not null,

    foreign key (id_actividad)
        references actividad(id_actividad)
);

create table plan_estudio (
    id_plan_estudio serial primary key,
    objetivo text not null,
    duracion varchar,
    recomendacion_general text,
    fecha_generacion date default current_date,
    id_analisis int not null,

    foreign key (id_analisis)
        references analisis(id_analisis)
);

create table tema (
    id_tema serial primary key,
    nombre varchar not null,
    descripcion text
);

create table plan_tema (
    id_plan_estudio int not null,
    id_tema int not null,

    primary key (id_plan_estudio, id_tema),

    foreign key (id_plan_estudio)
        references plan_estudio(id_plan_estudio),

    foreign key (id_tema)
        references tema(id_tema)
);