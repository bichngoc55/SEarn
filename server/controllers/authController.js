import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import validator from "validator";
import express from "express";
import multer from "multer";
const app = express();
app.use(cookieParser());

const refreshTokens = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();

    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});
export const upload = multer({ storage: storage });

/* REGISTER USER */

export const register = async (req, res) => {
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

    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email + " " + password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // console.log("in backend login controller + accessToken" + accessToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//refresh
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    console.log(
      "backend inside refresh function controller + new access token :" +
        newAccessToken
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ msg: "Invalid refresh token" });
  }
};

//

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.password = passwordHash;
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// 1. Update Name
export const updateName = async (req, res) => {
  try {
    await body("name").isString().trim().isLength({ min: 1, max: 50 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const user = await getUserById(userId);

    user.name = req.body.name;
    await user.save();

    res.json({ message: "Name updated successfully", user });
  } catch (error) {
    handleError(error, res);
  }
};

// 2. Update Background Image URL
export const updateBackgroundImage = async (req, res) => {
  upload.single("backgroundImage")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: "Error uploading file" });
    } else if (err) {
      console.error("Unknown Error:", err);
      return res.status(500).send({ error: "Internal Server Error" });
    }

    try {
      const userId = req.user;
      console.log(userId);
      const user = await getUserById(userId);

      if (req.file) {
        user.backgroundImageUrl = req.file.path;
      } else {
        return res.status(400).json({ error: "No file provided" });
      }

      await user.save();

      res.json({ message: "background URL updated", user });
    } catch (error) {
      console.error("Error updating background URL:", error);
      res.status(500).send({ error: "Failed to update background" });
    }
  });
};

// 3. Update Avatar URL
export const updateAvatar = async (req, res) => {
  upload.single("avatar")(req, res, async (err) => {
    console.log("Request object:", req); // Log the entire req object
    console.log("Headers: ", req.headers); // Log ALL headers
    console.log("req.file:", req.file); // Log just the file details
    console.log("req.body", req.body); // Log potential form data
    console.log("req file path : " + req.body.files);
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided." });
    }
    // console.log(req.body._parts);
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: "Error uploading file" });
    } else if (err) {
      console.error("Unknown Error:", err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided." });
    }
    // console.log("trong update Avtar :" + req.file.path);
    try {
      const userId = req.user;
      console.log(userId);
      const user = await getUserById(userId);

      if (req.file) {
        user.avaURL = req.file.path;
      } else {
        return res.status(400).json({ error: "No file provided" });
      }

      await user.save();

      res.json({ message: "Avatar updated", user });
      // if (req.body._parts && req.body._parts.length > 0) {
      //   const fileData = req.body._parts[0][1];
      //   if (fileData) {
      //     const fileExtension = fileData.type.split("/")[1];
      //     const fileName = `${Date.now()}.${fileExtension}`;
      //     const filePath = path.join("uploads", fileName);

      //     // Update the user's avaURL with the file path
      //     user.avaURL = filePath;
      //     await user.save();

      //     res.json({ message: "Avatar updated", user });
      //   } else {
      //     return res.status(400).json({ error: "No file data provided" });
      //   }
      // } else {
      //   return res.status(400).json({ error: "No file data provided" });
      // }
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).send({ error: "Failed to update avatar" });
    }
  });
};

// 4. Update Liked Songs
// export const updateLikedSongs = async (req, res) => {
//   try {
//     await body("likedSongs").isString().run(req);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const userId = req.user.id;
//     const user = await getUserById(userId);

//     user.likedSongs = req.body.likedSongs;
//     await user.save();

//     res.json({ message: "Liked songs updated", user });
//   } catch (error) {
//     handleError(error, res);
//   }
// };

const handleError = (error, res) => {
  console.error("Error:", error);
  const statusCode = error.statusCode || 500;
  const errorMessage =
    statusCode === 500 ? "Internal server error" : error.message;
  res.status(statusCode).json({ message: errorMessage });
};
export const updateLikedAlbums = async (req, res) => {
  const { id } = req.params;
  const { albumId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { likedAlbums: albumId },
      },
      { new: true }
    );
    await user.save();

    res.json({ message: "Liked album updated", user });
  } catch (error) {
    handleError(error, res);
  }
};
export const updateLikedSongs = async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { likedSongs: songId },
      },
      { new: true }
    );
    await user.save();

    res.json({ message: "Liked songs updated", user });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateLikedArtist = async (req, res) => {
  const { id } = req.params;
  const { artistId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { likedArtists: artistId },
      },
      { new: true }
    );
    await user.save();

    res.json({ message: "Liked artist updated", user });
  } catch (error) {
    handleError(error, res);
  }
};

export const getLikedAlbums = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.json(user.likedAlbums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
export const getLikedArtist = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.json(user.likedArtists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
export const getLikedSongs = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.json(user.likedSongs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
