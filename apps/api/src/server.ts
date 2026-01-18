import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { prisma, passport } from './config/index'
import { router, authRouter, uploadRouter } from './routes/index'
import { createServer } from 'http'
import { WebSocketServer } from 'ws';

const app = express()
const PORT = process.env.PORT || '3000'
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

    const wss = new WebSocketServer({ server: httpServer }) //websocket server


    //handle websocket connections
    wss.on('connection', (ws, req) => {
      console.log('new websocket connection established');

      //handle incoming messages
      ws.on('message', (data) => {
        console.log('received :', data.toString());

        // broadcast to all clients
        ws.send(`server received: ${data}`)
      })

      //handle errors
      ws.on('error', (error) => {
        console.error('websocket error:', error);
      })

      //handle close
      ws.on('close', () => {
        console.error('websocket connection closed');
      })

      ws.send('Welcome to the chat server!')//send welcome message
    })
    httpServer.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
      console.log(`WebSocket server ready at ws://localhost:${PORT}`)

      console.log("Database and server are ready!");
    })
    //handle graceful shutdown
    const shutdown = async () => {
      console.log('Initiating graceful shutdown...');

      //close all websocket connections
      wss.clients.forEach((client) => {
        client.close()
      })
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

    // Handle uncaught exceptions
    process.on("uncaughtException", async (error) => {
      console.error("Uncaught Exception:", error);
      await prisma.$disconnect();
      process.exit(1);
    });

    process.on("unhandledRejection", async (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      await prisma.$disconnect();
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma
      .$disconnect()
      .catch((e) =>
        console.error("Error during Prisma disconnect on startup failure:", e)
      );

    process.exit(1);
  }
}

startServer()



