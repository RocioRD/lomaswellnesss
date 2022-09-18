create database lomaswellnesss;
use lomaswellnesss;

-- creacion de la tabla suscripcion --
create table user(
  userId int unsigned not null auto_increment primary key,
  userName varchar(50) not null,
  email varchar(100) not null,
  password varchar(100) not null
);


insert into user set
userName = 'Blanca2',
email =  'blanca2@blanca2.com',
password=  'blanca2@blanca2.com';

insert into user set
userName = 'Rocio2',
email =  'Rocio2@Rocio2.com',
password=  'Rocio2@Rocio2.com';

insert into user set
userName = 'Blanca3',
email =  'blanca3@blanca3.com',
password=  'blanca3@blanca3.com';

insert into user set
userName = 'Rocio3',
email =  'Rocio3@Rocio3.com',
password=  'blanca3@blanca3.com';

DELETE FROM user where userName like 'Rocio%';

UPDATE user 
SET email = 'boke@boke.com'
WHERE userName like '%lanc%';





