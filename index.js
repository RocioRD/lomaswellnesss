require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const  mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 8080;
const nodemailer = require('nodemailer');

// configurar middelwares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

// configuracion del motor de plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'))
//connection.end();

const conexion = mysql.createConnection({
  host: process.env.HOST_DATABASE,
  user: process.env.USER_DATABASE,
  port: process.env.PORT_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  database: process.env.DATABASE
});


conexion.connect((err) => {
  if (err) {
    console.error(`Error en la conexion: ${err.stack}`)
    return;
  }
  console.log(`Conectado a la base de datos ${process.env.DATABASE}`);
  });

app.listen(PORT, () => {
  console.log(`el servidor esta trabajando en el Puerto ${PORT}`);
});

 app.get('/', (req, res) => {
  res.render('index', {
    nombre: 'Rocio Ruperto',
  })
});
 
app.get('/contacto', (req, res) => {
  res.render('contacto', {
    nombre: 'Rocio Ruperto',
  })
});

app.get('/servicios', (req, res) => {
  res.render('servicios', {
    nombre: 'Rocio Ruperto',
  });
});

  app.get('/crearusuario', (req, res) => {
    res.render('crearusuario', {
      nombre: 'Rocio Ruperto',
      titulo: 'Crear usuario',
    });
});

app.post('/crearusuario', (req, res) => {
  console.log(req.body);
  let mensaje = '';
  let codeError=true;
  /********************************** */
  if(req.body.nombre == '' || req.body.email == '') {
    mensaje = 'Rellene los campos correctamente';
    res.render('crearusuario', {
      titulo: 'Crear usuario',
      codeError,
      mensaje
    });
  } 
  else {

   let datos = {
      userName: req.body.nombre,
     email: req.body.email,
     password: req.body.password

   };

   let sql = 'INSERT INTO user SET ?'; //CREATE O ALTA
   console.log(sql)
    conexion.query(sql, datos, (error, result) => {
      mensaje = 'Perfecto!';
      codeError =false;
      if (error) { 
        mensaje = error;
        res.render('crearusuario', {
          titulo: 'Crear usuario',
          codeError: false,
          mensaje
        });
      };
        res.render('crearusuario', {
             titulo: 'Crear usuario',
             codeError,
             mensaje
        });
    });
  }

});

  /*********************************** */
  app.get('/login', (req, res) => {
    res.render('login', {
      nombre: 'Rocio Ruperto',
      titulo: 'Login',
    });
  });

  
  app.post('/login', (req, res) => {
    let mensaje = '';
    let codeError=true;
    /********************************** */
    if(req.body.nombre == '' || req.body.email == '') {
      mensaje = 'Rellene los campos correctamente';
      res.render('login', {
        titulo: 'login',
        codeError,
        mensaje
      });
    } 
    else {
      
     let datos = {
       email: req.body.email,
       password: req.body.password
     }

     let sql = `SELECT password FROM user WHERE email='` + req.body.email + `'`;
     let password = ''
     conexion.query(sql, (error, results, fields) => {
      if (error) { 
        mensaje = error;
        res.render('login', {
          titulo: 'Login',
          codeError: false,
          mensaje
        });
      };
       
       mensaje = 'Chequee mail o contrasenia';
       
       password = results[0].password     
       
       if(password === req.body.password) {
        codeError= false;
        mensaje = 'Has logrado entrar!';
        res.render('login', {
          titulo: 'login',
           codeError,
           mensaje
        });

       } else {
        codeError= true;
        mensaje = 'No has logrado entrar.';
        res.render('login', {
          titulo: 'login',
           codeError,
           mensaje
        });
       }
 
    });
 
    }
    
  })

app.get('/contacto', (req, res) => {
  res.render('contacto', {
    titulo: 'Formulario para suscripcion'
  })
});
  
app.post('/contacto', (req, res) => {
  
    const { nombre, email } = req.body;
    let fecha = new Date();
    //let dia = fecha.getFullYear();
  
    if (nombre == '' || email == '') {
      let validacion = 'Rellene la suscripción correctamente.';
      res.render('contacto', {
        titulo: 'Formulario para suscripcion',
        validacion
      });
     }else{
  
      console.log(nombre);
      console.log(process.env.PASSWORD_GMAIL);
  
        async function envioMail(){
       
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true,
            auth: { 
              user: process.env.USERMAIL, 
              pass: process.env.PASSWORD_GMAIL  //16 caracteres que da gmail
              }
          });
  
          let envio = await transporter.sendMail({
              from: process.env.USERMAIL,
              to: `${email}`,
              subject: 'Gracias por suscribirte a nuestra empresa',
              html: `Muchas gracias por contactarse con nosotros, estaremos enviando su pedido a la brevedad. <br>
               Todas nuestras promociones ya estarán a su disposición. <br>
               ${fecha}`
          });
  
          //res.send(`Tu nombre es ${nombre} y tu email registrado es ${email}`);
          res.render('enviado', {
              titulo: 'mail enviado',
              nombre, 
              email
          })  
      }
      envioMail();
    }
  
  })

  app.get('/editarBorrar', (req, res) => {

    let sql = `SELECT userId, userName, email FROM user`;

    conexion.query(sql, (error, results, fields) => {
      res.render('editarBorrar', {
        nombre: 'Rocio Ruperto',
        titulo: 'Editar Borrar usuario',
        usuarios: results
      });
    })
})
/*
CRUD = L-ABM
C: CREATE - ALTA
R: READ - LECTURA
U: UPDATE -MODIFICACIÓN
D: DELETE - BAJA - BORRAR

*/
app.get('/borrarUsuario/:idUsuario', (req, res) => {

    let sql = `DELETE FROM user WHERE userId='` + req.params.idUsuario + `'`;
  
    conexion.query(sql, (error, results, fields) => {});
    res.redirect('/editarBorrar');
})

/*
app.get('/editarUsuario/:idUsuario', (req, res) => {
  let codeError = 0

  // armar la query para que este el userId, nombre y el email
  // enviar el nombre y el email a editarElUsiario
  //en la instruccion de abajo vas a agregar el nombre y el email que trajiste por sql
  // en la pagina editarElUsuario.hbs vas a mostrar el contenido de dichas variables como sucede con 'petela'
  let sql = `SELECT userId, userName, email FROM user where userID = '` + req.params.idUsuario + `'`;

  conexion.query(sql, (error, results, fields) => {
    let userId = results[0].userId
    let userName = results[0].userName
    let email = results[0].email
    res.render('editarElUsuario', {
      titulo: 'Editar usuario',
      id: userId,
      nombre: userName,
      email: email
    });
  
});

  //res.redirect('/editarElUsuario');



});

app.post('/editarUsuario/:idUsuario', (req, res) => {
  let username = req.body.nombre
  let email = req.body.email

  let sql = `UPDATE user SET userName = '` + username + `', email= '` + email + `' WHERE userId ='` + req.params.idUsuario + `'`;

  conexion.query(sql, (error, results, fields) => {});
  res.redirect('/editarBorrar');
});
*/


app.route('/editarUsuario/:idUsuario')

  .get(function (req, res, next) {
    let codeError = 0

    // armar la query para que este el userId, nombre y el email
    // enviar el nombre y el email a editarElUsiario
    //en la instruccion de abajo vas a agregar el nombre y el email que trajiste por sql
    // en la pagina editarElUsuario.hbs vas a mostrar el contenido de dichas variables como sucede con 'petela'
    let sql = `SELECT userId, userName, email FROM user where userID = '` + req.params.idUsuario + `'`;
  
    conexion.query(sql, (error, results, fields) => {
      let userId = results[0].userId
      let userName = results[0].userName
      let email = results[0].email
      res.render('editarElUsuario', {
        titulo: 'Editar usuario',
        id: userId,
        nombre: userName,
        email: email
      });
    
  });
  
  })
  .post(function (req, res, next) {
     let username = req.body.nombre
    let email = req.body.email
  
    let sql = `UPDATE user SET userName = '` + username + `', email= '` + email + `' WHERE userId ='` + req.params.idUsuario + `'`;
  
    conexion.query(sql, (error, results, fields) => {});
    res.redirect('/editarBorrar');
  })