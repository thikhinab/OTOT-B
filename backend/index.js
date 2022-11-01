import express from "express";
import mongoose from "mongoose";
import parser from "body-parser";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

import bookRouter from "./routes/book-router.js";
dotenv.config();
console.log(process.env.VIMUTH);
const env = process.env.NODE_ENV || "development";

const app = express();
const port = process.env.PORT || 8080;

// Set up database
if (env === "production") {
  mongoose.connect(
    process.env.MONGODB_URI_PROD,
    () => console.log("Connected to Database"),
    (err) => console.log(err)
  );
} else {
  (async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(
      mongoUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log("Connected to Database"),
      (err) => console.log(err)
    );
  })();
}

// Debugging
console.log(
  "variables:",
  env,
  process.env.MONGODB_URI_PROD,
  process.env.VIMUTH
);

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
