import User from "../models/User.js";
import Report from "../models/Report.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(
      reports.map((report) => ({
        title: report.title,
        content: report.getDecryptedContent(), // Decrypt report content
        submittedAt: report.submittedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
};
