import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 5,
      max: 70,
    },
    accountId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      min: 5,
      max: 70,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    ava: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    location: String,
    gender: {
      type: String,
      enum: ["nam", "nu"],
      required: true,
    },
    likedSongs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    likedPlaylists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    spotifyAccessToken: { type: String },
    spotifyRefreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
