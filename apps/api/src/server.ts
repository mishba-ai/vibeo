import express from 'express'
const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { prisma, passport } from './config/index'
const PORT = process.env.PORT || '0.0.0.0'
import { router, authRouter } from './routes/index'
const apiRoutes = router

//middleware
app.use(cors({
    origin: ['http://127.0.0.1:5173','http://localhost:5173'], 
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize()); // Initialize Passport

//mount all api routes under /api/v1
app.use("/api/v1/", apiRoutes);
app.use("/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
      console.log("Database and server are ready!");
    })

    //handle graceful shutdown
    const shutdown = async () => {
      console.log('Initiating graceful shutdown...');
      server.close(async () => {
        console.log('HTTP server closed.');
        // disconnect prisma client
        await prisma.$disconnect()
        console.log('prisma client disconnected from Database');
        process.exit(0)
      })
    };
    // This signal is typically sent by process managers (e.g., pm2, Docker)
    process.on('SIGTERM', shutdown)
    // This signal is sent when press Ctrl+C in the terminal
    process.on("SIGINT", shutdown)

    // Handle uncaught exceptions
    process.on("uncaughtException", async (error) => {
      console.error("Uncaught Exception:", error);
      await prisma.$disconnect(); // Ensure Prisma disconnects on critical errors
      process.exit(1);
    });

    process.on("unhandledRejection", async (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      await prisma.$disconnect(); // Ensure Prisma disconnects on critical errors
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



