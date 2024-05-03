import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

import SpotifyWebApi from "spotify-web-api-node";
import spotifyWebApi from "spotify-web-api-node";
import FacebookStrategy from "passport-facebook";
import { linkSpotifyAccount } from "./controllers/authController.js";
//config
dotenv.config();
const spotifyApi = new SpotifyWebApi({
  clientId: "19380ddfc0344af29cb61de3c6655fda",
  clientSecret: "1b0bf947882f4b89a1705cc65443ae9c",
  redirectUri: "http://localhost:8080",
});
//express app
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//use
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("common"));
app.use(express.json());
// app.use(express.static("public"));
app.use(cookieParser());

// /* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// //upload
// app.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   const fileInfo = {
//     originalname: file.originalname,
//     mimetype: file.mimetype,
//     size: file.size,
//     path: file.path,
//   };
//   res.send(fileInfo);
// });

//express
app.use("/auth", authRoutes);
app.get("/search", (req, res) => {
  // Extract the search query parameter.
  const { q } = req.query;

  // Make a call to Spotify's search API with the provided query.
  spotifyApi
    .searchTracks(q)
    .then((searchData) => {
      // Extract the URI of the first track from the search results.
      const trackUri = searchData.body.tracks.items[0].uri;
      // Send the track URI back to the client.
      res.send({ uri: trackUri });
    })
    .catch((err) => {
      console.error("Search Error:", err);
      res.send("Error occurred during search");
    });
});

// Route handler for the play endpoint.
app.get("/play", (req, res) => {
  const { uri } = req.query;

  spotifyApi
    .play({ uris: [uri] })
    .then(() => {
      res.send("Playback started");
    })
    .catch((err) => {
      console.error("Play Error:", err);
      res.send("Error occurred during playback");
    });
});

app.use("/auth", authRoutes);
app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    console.log(code);
    console.log(state);
    const user = await User.find;
    if (user) {
      const credentials = await spotifyApi.authorizationCodeGrant(code);

      await linkSpotifyAccount(code, user._id, res);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error in callback:", error);
    res.status(500).json({ error: "An error occurred in the callback." });
  }
});
// app.get("/callback", async (req, res) => {
//   const code = req.query.code; // The code from Spotify
//   try {
//     // Exchange the code for an access token and refresh token
//     const credentials = await spotifyApi.authorizationCodeGrant(code);
//     const { access_token, refresh_token } = credentials.body;

//     // Assume 'state' is the user's ID or another identifier you've passed to Spotify's authorize URL
//     // You need to include the user's ID or a unique identifier in the state parameter when redirecting to Spotify's authorization URL.
//     const userId = req.query.state;

//     // Find the user in your database
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     await linkSpotifyAccount(code, user._id, res);
//     // Update the user's document with the Spotify tokens
//     user.spotifyAccessToken = access_token;
//     user.spotifyRefreshToken = refresh_token;
//     await user.save();

//     // Redirect the user or send a response, as per your app's flow
//     res.send("Spotify account linked successfully.");
//   } catch (error) {
//     console.error("Error in the callback handling:", error);
//     res.status(500).send("An error occurred.");
//   }
// });
app.get("/", (req, res) => {
  res.send("Hello to Memories API");
});
//connect to mongodb
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error: ", error.message);
  });
//listener
app.listen(process.env.PORT, () => {
  console.log("Server is running on port ", process.env.PORT);
});
