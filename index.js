//inicializador
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs')
const path = require('path');
const app = express();
const port = 3000; 

app.get('/',(req, res) => {
    res.send('hola, mundo');
})

app.listen(port,()=>{
    console.log(`servidor escuchando en http://localhost:${port}`);
})

//ruta para obtener datos
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  
  app.get('/users', (req, res) => {
    res.json(users);
  });


  //ruta para obtener un usuario por su ID:
  app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });

//soporte para peticiones POST
  app.use(bodyParser.json());
  
  app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
  });
  
  //Agregar una ruta para actualizar un usuario existente:
  app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;
      res.json(updatedUser);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });

  //ruta para eliminar un usuario existente:
  app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1);
      res.json(deletedUser);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
  
  //para validar los datos entrantes antes de procesarlos joi:
  const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().min(3).required()
});

app.post('/users', (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


// Crear un flujo de escritura (write stream) para el archivo de registro
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Configurar Morgan para registrar en el archivo
app.use(morgan('combined', { stream: accessLogStream }));

// También puedes registrar en la consola utilizando otro formato
app.use(morgan('dev'));

// Definir algunas rutas de ejemplo
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/usuarios', (req, res) => {
  res.json([{ name: 'Juan' }, { name: 'María' }]);
});
