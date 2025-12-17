import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    faculty: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    course: {
      type: String
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);

