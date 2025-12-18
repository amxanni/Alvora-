import express from "express";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET MESSAGES FOR A GROUP
router.get("/group/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ group_id: groupId })
      .sort({ createdAt: 1 });

    const userIds = [...new Set(messages.map((m) => m.user_id.toString()))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id full_name email");

    const profileMap = new Map(users.map((u) => [u._id.toString(), {
      id: u._id.toString(),
      full_name: u.full_name,
      email: u.email,
    }]));

    const messagesWithProfiles = messages.map((m) => ({
      id: m._id.toString(),
      group_id: m.group_id.toString(),
      user_id: m.user_id.toString(),
      text: m.text,
      file_url: m.file_url,
      file_name: m.file_name,
      type: m.type,
      created_at: m.createdAt,
      profiles: profileMap.get(m.user_id.toString()) || { full_name: "Utilizator", email: "" },
    }));

    res.json(messagesWithProfiles);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
});

export default router;

