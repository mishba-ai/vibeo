import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { prisma, passport } from './config/index'
import { router, authRouter, uploadRouter } from './routes/index'
import { createServer } from 'http'
import { ChatWebSocketServer } from './websocket/ChatWebSocketServer';

const app = express()
const PORT = process.env.PORT || '3001'
const apiRoutes = router

//middleware 
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']

}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(passport.initialize()); // Initialize Passport

//mount all api routes under /api/v1
app.use("/api/v1", apiRoutes);
app.use("/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const startServer = async () => {
  try {
    const httpServer = createServer(app) //Http server

    const wss = new ChatWebSocketServer( httpServer ) //websocket server

    httpServer.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
      console.log(`WebSocket server ready at ws://localhost:${PORT}`)

      console.log("Database and server are ready!");
    })
    //handle graceful shutdown
    const shutdown = async () => {
      console.log('Initiating graceful shutdown...');

      httpServer.close(async () => {
        console.log('HTTP server closed.');
        // disconnect prisma client
        await prisma.$disconnect()
        console.log('prisma client disconnected from Database');
        process.exit(0)
      })
    };

    process.on('SIGTERM', shutdown)
    process.on("SIGINT", shutdown)

  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma
      .$disconnect()
      .catch((e:Error) =>
        console.error("Error during Prisma disconnect on startup failure:", e)
      );

    process.exit(1);
  }
}

startServer()



