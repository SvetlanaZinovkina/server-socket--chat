import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormbody from "@fastify/formbody";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT;

const server = Fastify({
  logger: true,
});

server
  .register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  })
  .decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

server.register(fastifyCookie);
server.register(fastifyMultipart);
server.register(fastifyFormbody);

server.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    socket.on("message", (msg) => {
      console.log("message: " + msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});

routes(server);

server.listen({ port: PORT });
