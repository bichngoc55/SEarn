import mongoose from "mongoose";

const { Schema } = mongoose;

const playlistSchema = new mongoose.Schema(
  {
    description: String,
    imageResource: Number,
    imageURL: String,
    name: { type: String, required: true },
    privacy: String,
    privacyIcon: Number,
    songCount: Number,
    songs: [String],
    thumbNail: Number,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
