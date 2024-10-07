import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCors from '@fastify/cors';

const server = Fastify({
    logger: true,
  });
  server.register(fastifyCors, {
    origin: (origin, cb) => {
      cb(null, true); // Разрешаем запросы с любого источника
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Разрешенные HTTP методы
  });
  server.register(fastifyIO, {
    cors: {
      origin: 'http://localhost:3000', // Разрешаем запросы с frontend
      methods: ['GET', 'POST'], // Разрешенные методы для WebSocket
    },
  });

server.get("/", (req, reply) => {
  reply.send('Ehf')

});

server.ready().then(() => {
  // we need to wait for the server to be ready, else `server.io` is undefined
  server.io.on("connection", (socket) => {
    // console.log("Работает")
    socket.on('message', (msg) => {
          console.log('message: ' + msg);
        });
        
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
  });
});

server.listen({ port: 5001 });

// import Fastify from 'fastify';
// import fastifyCors from '@fastify/cors';
// import socketio from 'socket.io';

// const fastify = Fastify({
//   logger: true,
// });

// // Настройка CORS
// fastify.register(fastifyCors, {
//   origin: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// });

// // Маршрут для проверки работы
// fastify.get('/', async (req, rep) => {
//   return rep.send('dct работает');
// });

// // Настройка Socket.io

// const io = socketio(fastify.server);

// io.on('connection', (socket) => {
//   console.log('a user connected');
  
//   // Обработка событий
//   socket.on('message', (msg) => {
//     console.log('message: ' + msg);
//   });
  
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// fastify.listen(5001, (err) => {
//   if (err) throw err;
//   console.log('Server listening on port 5001');
// });
// start();
