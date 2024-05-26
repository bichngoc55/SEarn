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
      min: 6,
    },
    avaURL: {
      type: String,
      default: "",
    },
    backgroundImageUrl: {
      type: String,
      default: "",
    },
    likedSongs: [
      {
        type: String,
      },
    ],
    recentListeningSong: {
      artistName: { type: String },
      imageURL: { type: String },
      songId: { type: String },
      songName: { type: String },
    },
    notificationCount: {
      type: Number,
    },
    likedArtists: [{ type: String }],
    likedAlbums: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
