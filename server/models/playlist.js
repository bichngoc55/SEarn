import mongoose from "mongoose";

const { Schema } = mongoose;

const playlistSchema = new mongoose.Schema(
  {
    description: String,
    imageURL: {
      type: String,
      default: "/uploads/avatar-1716923032362-461644826.jpg",
    },
    name: { type: String, required: true },
    privacyOrPublic: { type: Boolean, required: true },
    songCount: Number,
    songs: [String],
    numberOfLikes: { type: Number, default: 0 },
    userIdOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listUserIdLikes: [{ type: String }],
    thumbNail: Number,
  },
  { timestamps: true }
);
const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
