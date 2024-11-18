import express, { NextFunction, Request, Response } from "express";
import MongoConnction from "../config";
import * as dotenv from "dotenv";
import mainRoute from "./routes";
import morgan from "morgan";
import cors from 'cors';
const app = express();
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(morgan("combined"));

const mongoConnect = new MongoConnction();

(async () => {
  try {
    //conecting to mongodb
    console.log("connecting to mongodb ...");
    const mongodb = await mongoConnect.init();
    console.log("Mongodb connected successfully!");
  } catch (err) {
    console.error("\nError while connecting to MongoDB!\n", err);
  }
})();

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json("Howdy! Server is live");
});

app.use("/api", mainRoute);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error (avoid logging sensitive data)
  
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      error: err.message, // Show error details in development only
    });
  });
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
