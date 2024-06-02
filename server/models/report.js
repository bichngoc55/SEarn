import mongoose from "mongoose";

const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    content: [
      {
        type: String,
        required: true,
      },
    ],
    email: {
      type: String,
      required: true,
      max: 50,
      trim: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);

export default Report;
