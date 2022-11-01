import express from 'express';
import mongoose from 'mongoose'
import parser from 'body-parser'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server';

import bookRouter from './routes/book-router.js'
dotenv.config()
const env = process.env.NODE_ENV || "development";

const app = express();
const port = 8080;


let mongoDbUri = ""
if (env === "production") {
  mongoDbUri = process.env.MONGODB_URI_PROD
} else {
  const mongoServer = await MongoMemoryServer.create();
  mongoDbUri = mongoServer.getUri()
}

mongoose.connect(
  mongoDbUri,
  () => console.log("Connected to Database"),
  (err) => console.log(err)
);

app.use("/api/books", parser.json(), bookRouter);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export default app;
