import express from "express";
import { Group } from "../models/Group.js";
import { GroupMember } from "../models/GroupMember.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL GROUPS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    const groupIds = groups.map(g => g._id);

    const members = await GroupMember.find({ group_id: { $in: groupIds } });
    const memberMap = new Map();
    members.forEach(m => {
      if (!memberMap.has(m.group_id.toString())) {
        memberMap.set(m.group_id.toString(), []);
      }
      memberMap.get(m.group_id.toString()).push(m.user_id.toString());
    });

    const formattedGroups = groups.map((g) => {
      const groupMembers = memberMap.get(g._id.toString()) || [];
      return {
        id: g._id.toString(),
        name: g.name,
        faculty: g.faculty,
        year: g.year,
        course: g.course,
        description: g.description,
        member_count: groupMembers.length,
        is_member: groupMembers.includes(req.user.id),
        created_by: g.created_by.toString(),
        created_at: g.createdAt,
        updated_at: g.updatedAt,
      };
    });

    res.json(formattedGroups);
  } catch (err) {
    console.error("Get groups error:", err);
    res.status(500).json({ message: "Failed to fetch groups." });
  }
});

// GET MY GROUPS
router.get("/my-groups", authMiddleware, async (req, res) => {
  try {
    const memberships = await GroupMember.find({ user_id: req.user.id });
    const groupIds = memberships.map(m => m.group_id);

    const groups = await Group.find({ _id: { $in: groupIds } }).sort({ createdAt: -1 });

    const allMembers = await GroupMember.find({ group_id: { $in: groupIds } });
    const memberCountMap = new Map();
    
    allMembers.forEach(m => {
      const gId = m.group_id.toString();
      memberCountMap.set(gId, (memberCountMap.get(gId) || 0) + 1);
    });

    const formattedGroups = groups.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      faculty: g.faculty,
      year: g.year,
      course: g.course,
      description: g.description,
      member_count: memberCountMap.get(g._id.toString()) || 0,
      is_member: true,
      created_by: g.created_by.toString(),
      created_at: g.createdAt,
      updated_at: g.updatedAt,
    }));

    res.json(formattedGroups);
  } catch (err) {
    console.error("Get my groups error:", err);
    res.status(500).json({ message: "Failed to fetch user groups." });
  }
});

// GET GROUP BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json({
      id: group._id.toString(),
      name: group.name,
      faculty: group.faculty,
      year: group.year,
      course: group.course,
      description: group.description,
      created_by: group.created_by.toString(),
      created_at: group.createdAt,
      updated_at: group.updatedAt,
    });
  } catch (err) {
    console.error("Get group error:", err);
    res.status(500).json({ message: "Failed to fetch group." });
  }
});

// CREATE GROUP
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, faculty, year, course } = req.body;

    if (!name || !faculty || !year) {
      return res.status(400).json({ message: "Complete all required fields." });
    }

    const group = await Group.create({
      name: name.trim(),
      description: description?.trim() || null,
      faculty,
      year: parseInt(year),
      course: course?.trim() || null,
      created_by: req.user.id,
    });

    await GroupMember.create({
      group_id: group._id,
      user_id: req.user.id,
    });

    res.status(201).json({
      message: "Group created successfully.",
      group: {
        id: group._id.toString(),
        name: group.name,
        faculty: group.faculty,
        year: group.year,
        course: group.course,
        description: group.description,
        created_by: group.created_by.toString(),
      },
    });
  } catch (err) {
    console.error("Create group error:", err);
    res.status(500).json({ message: "Failed to create group." });
  }
});

// DELETE GROUP
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.created_by.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this group." });
    }

    await Group.deleteOne({ _id: id });
    await GroupMember.deleteMany({ group_id: id });
    
    res.json({ message: "Group deleted successfully." });
  } catch (err) {
    console.error("Delete group error:", err);
    res.status(500).json({ message: "Failed to delete group." });
  }
});

// JOIN GROUP
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const existing = await GroupMember.findOne({
      group_id: id,
      user_id: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: "Already a member of this group." });
    }

    await GroupMember.create({
      group_id: id,
      user_id: req.user.id
    });

    res.json({ message: "Joined group successfully." });
  } catch (err) {
    console.error("Join group error:", err);
    res.status(500).json({ message: "Failed to join group." });
  }
});

// LEAVE GROUP
router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.created_by.toString() === req.user.id) {
      return res.status(400).json({ message: "Creator cannot leave the group. Delete it instead." });
    }

    await GroupMember.deleteOne({
      group_id: id,
      user_id: req.user.id
    });

    res.json({ message: "Left group successfully." });
  } catch (err) {
    console.error("Leave group error:", err);
    res.status(500).json({ message: "Failed to leave group." });
  }
});

export default router;
