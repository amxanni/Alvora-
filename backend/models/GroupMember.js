import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

groupMemberSchema.index({ group_id: 1, user_id: 1 }, { unique: true });

export const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

