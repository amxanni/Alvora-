import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String
    },
    file_url: {
      type: String
    },
    file_name: {
      type: String
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

