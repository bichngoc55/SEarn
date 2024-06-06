import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Web3 from "web3";
import validator from "validator";
import Playlist from "./models/playlist.js";
import authRoutes from "./routes/auth.js";
import multer from "multer";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import playlistRoutes from "./routes/playlist.js";
import reportRoutes from "./routes/report.js";
// Import PlaylistLikes.json with type assertion
// import type { PlaylistLikesJson } from "./contracts/PlaylistLikes.json"; // 1. Type import
// import configuration from "./contracts/PlaylistLikes.json" with { type: "json" }; // 2. Data import
// import contractData from "./contracts/PlaylistLikes.json" assert { type: "json" };

import contractData from "./contracts/PlaylistLikes.json" assert { type: "json" };

const { abi, bytecode } = contractData;
// const contract_abi = configuration.abi;
// const contract_address = configuration.networks["5777"].address;

let sender, web3, contract;
//config
dotenv.config();
//express app
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//use
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3005",
  })
);
// app.use(cors());
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
// app.use(express.static("public"));
app.use(cookieParser());

app.use(cors());
//express
app.use("/auth", authRoutes);
app.use("/playlists", playlistRoutes);
app.use("/report", reportRoutes);
//connect to mongodb

const init = async () => {
  //  web3 = new Web3("http://127.0.0.1:9545/");
  web3 = new Web3("http://127.0.0.1:7545");
  // const coin = require("./contracts/PlaylistLikes.json");
  // const coin = await import("./contracts/PlaylistLikes.json").then(
  //   (module) => module.default
  // );

  // Contract ABI and address (obtained from deployment)

  // Create a contract instance
  contract = new web3.eth.Contract(
    abi,
    "0x1073B9359f66bE231C6AAa34F8A48adce1815955"
  );
  // 0x74c6936779343d349A492F8c9070dC63c59A66df
  // 0xe1fe593C8C338D024Db62DDDaC666C94B42f8C12
  // Get the first Ganache account
  const accounts = await web3.eth.getAccounts();
  sender = accounts[0];
  // console.log(accounts);
  // console.log("contract: " + contract.methods);
  // console.log("abi : " + abi);
  // console.log("sender :" + sender);
  // const balance = await web3.eth.getBalance(accounts[0]);
  // console.log("Balance of account 0:", balance);
  // // onsole.log("sender :"+sender);
  // const balance2 = await web3.eth.getBalance(
  //   "0x15DE328D2bF669bD9800ad3a2eD633e6BA27DD85"
  // );
  // console.log("Balance2 of account random:", balance2);
  // // Get the first Ganache account
  // const userId = "665ddd10a29ae0460fc0e947";
  // const userAccount = await User.findById(userId);
  // console.log("user heh: " + userAccount.userAddressEthereum);
  // const coin = await contract.methods
  //   .getUserCoins(userAccount.userAddressEthereum)
  //   .call();
  // const balance3 = await web3.eth.getBalance(userAccount.userAddressEthereum);
  // console.log("Balance3 of account random:", balance3);
  // const  result =  balance3+ BigInt(100);
  // console.log("reward user "+ result);
  // const coin = await contract.methods.getUserCoins("0x15DE328D2bF669bD9800ad3a2eD633e6BA27DD85").call();
  // console.log("coin : "+coin);
  // const weiAmount = await web3.utils.toWei('0.01', 'ether');
  // console.log("weiAmount : "+ weiAmount);
  // console.log("hhehehhehe");
  //     const receipt = await contract.methods.transfer(userAccount.userAddressEthereum, weiAmount).send({ from: sender });
  //     console.log("Transfer receipt:", receipt);

  // console.log("coin : " + coin);
};

init();

/* REGISTER USER */

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isValidEmail = validator.isEmail(email);

    if (!isValidEmail) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid Gmail email address" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // init();
    const newAccountAddress = web3.eth.accounts.create().address; //tạo 1 tk với 0 coin
    console.log("new account address: " + newAccountAddress);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      userAddressEthereum: newAccountAddress,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//nho sua playlist
app.put("/playlists/liked/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    // console.log("red body: " + req.body);
    const { userId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const isLiked = playlist.listUserIdLikes.includes(userId);
    // console.log("isLiked :" + isLiked);
    if (isLiked) {
      playlist.listUserIdLikes = playlist.listUserIdLikes.filter(
        (id) => id.toString() !== userId
      );
      playlist.numberOfLikes -= 1;
      // console.log("numberOfLikes : " + playlist.numberOfLikes);
    } else {
      playlist.listUserIdLikes.push(userId);
      playlist.numberOfLikes += 1;
      // console.log("numberOfLikes : " + playlist.numberOfLikes);
    }
    const userAccount = await User.findById(userId);
    const updatedPlaylist = await playlist.save();
    console.log("hehehe");
    if (playlist.numberOfLikes >= 5) {
      const weiAmount = await web3.utils.toWei("0.01", "ether");
      const receipt = await contract.methods
        .transfer(userAccount.userAddressEthereum, weiAmount)
        .send({ from: sender });
      // console.log("Transfer receipt:", receipt);
    }
    // console.log("hehehe");
    userAccount.userCoin = Number(
      await contract.methods
        .getUserCoins(userAccount.userAddressEthereum)
        .call()
    );
    const userCoin = userAccount.userCoin;
    userAccount.save();

    res.status(200).json({ updatedPlaylist, userCoin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/auth/:userId/coins", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId: ", userId);

    const userAccount = await User.findById(userId);

    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    const coin = userAccount.userCoin;
    // const userCoins = await contract.methods.getUserCoins(userAccount.userAddressEthereum).call();
    console.log(coin);
    res.status(200).json(coin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
