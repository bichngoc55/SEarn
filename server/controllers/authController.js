import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
const app = express();
app.use(cookieParser());
/* REGISTER USER */

let refreshTokens = [];
const spotifyApi = new SpotifyWebApi({
  clientId: "19380ddfc0344af29cb61de3c6655fda",
  clientSecret: "1b0bf947882f4b89a1705cc65443ae9c",
  redirectUri: "http://localhost:8080",
});
export const register = async (req, res) => {
  try {
    const {
      name,
      accountId,
      username,
      email,
      password,
      ava,
      phone,
      dateOfBirth,
      location,
      gender,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      accountId,
      username,
      email,
      password: passwordHash,
      ava,
      phone,
      dateOfBirth,
      location,
      gender,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) return res.status(400).json({ msg: "User does not exist. " });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     const refreshToken = jwt.sign(
//       { id: user._id },
//       process.env.REFRESH_TOKEN_SECRET,
//       {
//         expiresIn: "365d",
//       }
//     );
//     refreshTokens.push(refreshToken);
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       path: "/",
//       sameSite: "strict",
//     });
//     delete user.password;
//     res.status(200).json({ token, user, refreshToken });
//     console.log(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // If the user hasn't linked their account with Spotify, initiate the Spotify authentication flow
    if (!user.spotifyAccessToken || !user.spotifyRefreshToken) {
      const scopes = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-modify-playback-state",
      ];
      const state = user._id.toString();
      res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );
    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    delete user.password;

    // const { spotifyAccessToken, timeoutId } = await refreshUserSpotifyToken(
    //   user._id
    // );
    // res
    //   .status(200)
    //   .json({ token, user, refreshToken, spotifyAccessToken, timeoutId });
    console.log(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const refresh = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  const refreshToken = req.cookie.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: "No token, chua dang nhap" });
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ msg: "token nay invalid" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "365d",
      }
    );
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};
// postman

export const linkSpotifyAccount = async (code, userId, res) => {
  try {
    const credentials = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = credentials.body;
    console.log(
      "The access token and refresh token is" + access_token,
      refresh_token
    );
    spotifyApi.setAccessToken(access_token);
    // Update the user's document with the Spotify access token and refresh token
    const user = await User.findByIdAndUpdate(
      userId,
      {
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
      },
      { new: true }
    );

    // Start refreshing the access token periodically
    //refreshUserSpotifyToken(user._id);

    // Send a success response
    res.status(200).json({ message: "Spotify authentication successful!" });
  } catch (error) {
    console.error("Error getting Tokens:", error);
    res.status(500).json({ error: "Error getting tokens" });
  }
};
// export async function refreshUserSpotifyToken(userId) {
//   try {
//     const user = await User.findById(userId);
//     if (!user) throw new Error("User not found");

//     const accessToken = data.body["access_token"];
//     const refreshToken = data.body["refresh_token"];
//     const expiresIn = data.body["expires_in"];
//     spotifyApi.setRefreshToken(refreshToken);
//     setInterval(async () => {
//       const data = await spotifyApi.refreshAccessToken();
//       const accessTokenRefreshed = data.body["access_token"];
//       spotifyApi.setAccessToken(accessTokenRefreshed);
//       user.spotifyAccessToken = accessToken;
//       await user.save();
//     }, (expiresIn / 2) * 1000);
//   } catch (error) {
//     console.error("Failed to refresh Spotify token:", error);
//     throw error;
//   }
// }
export async function refreshUserSpotifyToken(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const refreshToken = user.spotifyRefreshToken;
    spotifyApi.setRefreshToken(refreshToken);

    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body["access_token"];
    const expiresIn = data.body["expires_in"];

    spotifyApi.setAccessToken(accessToken);
    user.spotifyAccessToken = accessToken;
    await user.save();

    const timeoutId = setTimeout(
      () => refreshUserSpotifyToken(userId),
      (expiresIn / 2) * 1000
    );

    return { spotifyAccessToken, timeoutId };
  } catch (error) {
    console.error("Failed to refresh Spotify token:", error);
    throw error;
  }
}
