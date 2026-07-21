insert into usuario (nombre_completo, correo, contrasena)
values ('juan perez', 'juan@mentia.com','123456');

insert into actividad (nombre_proyecto, lenguaje, codigo, estado, id_usuario)
values ('taller de condicionales', 'Python', 'print("hola mundo")', 'completado', 1);

insert into analisis ( puntaje, resumen, fortalezas, aspectos_mejorar, recomendacion, id_actividad)
values ( 95, 'Buen manejo de la lógica.', 'Uso correcto de condicionales.', 'Mejorar funciones.', 'Practicar modularización.', 1);


insert into plan_estudio ( objetivo, duracion, recomendacion_general, id_analisis)
values ( 'Fortalecer funciones y manejo de errores.','2 semanas', 'Practicar ejercicios de funciones.', 1);

insert into tema (nombre, descripcion)
values
('Condicionales', 'Uso de estructuras condicionales.'),
('Funciones', 'Creación y uso de funciones.'),
('Manejo de errores', 'Uso de try y except.');


insert into plan_tema ( id_plan_estudio, id_tema)
values
(1,1),
(1,2),
(1,3);


select * from usuario;
select * from actividad;
select * from analisis;
select * from plan_estudio;
select * from tema;
select * from plan_tema;