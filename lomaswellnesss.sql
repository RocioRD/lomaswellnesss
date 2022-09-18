create database lomaswellnesss;
use lomaswellnesss;

-- creacion de la tabla suscripcion --
create table user(
  userId int unsigned not null auto_increment primary key,
  userName varchar(50) not null,
  email varchar(100) not null,
  password varchar(100) not null
);



