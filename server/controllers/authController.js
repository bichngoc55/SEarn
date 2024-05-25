import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
const app = express();
app.use(cookieParser());
/* REGISTER USER */

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
