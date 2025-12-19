import express from "express";
import { User } from "../models/User.js";
import { GroupMember } from "../models/GroupMember.js";
import { Group } from "../models/Group.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET CURRENT USER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json({
      id: user._id.toString(),
      full_name: user.full_name,
      email: user.email,
      faculty: user.faculty,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// GET ALL PROFILES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ full_name: 1 });
    
    const userIds = users.map(u => u._id);
    const memberships = await GroupMember.find({ user_id: { $in: userIds } });
    
    const groupIds = [...new Set(memberships.map(m => m.group_id))];
    const groups = await Group.find({ _id: { $in: groupIds } }).select("name");
    
    const groupMap = new Map(groups.map(g => [g._id.toString(), g.name]));
    
    const userGroupsMap = new Map();
    memberships.forEach(m => {
      const userId = m.user_id.toString();
      const groupName = groupMap.get(m.group_id.toString());
      if (groupName) {
        if (!userGroupsMap.has(userId)) {
          userGroupsMap.set(userId, []);
        }
        userGroupsMap.get(userId).push(groupName);
      }
    });

    const profiles = users.map(u => ({
      id: u._id.toString(),
      full_name: u.full_name,
      email: u.email,
      faculty: u.faculty,
      groups: userGroupsMap.get(u._id.toString()) || []
    }));

    res.json(profiles);
  } catch (err) {
    console.error("Get profiles error:", err);
    res.status(500).json({ message: "Failed to fetch profiles." });
  }
});

export default router;
