// require("dotenv").config();
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: " + error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection failed!", err);
  });

// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_DB_URI}`);
//     app.on("error", (error) => {
//       console.log("Error: " + error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error: " + error);
//     throw error;
//   }
// })();
