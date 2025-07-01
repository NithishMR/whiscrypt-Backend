import User from "../models/User.js";
import Report from "../models/Report.js";
import { decrypt } from "../utils/encryption.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";

export const adminRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    // console.log(1);
    // Hash the password before saving;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt, " ", hashedPassword);
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "pending",
    });
    console.log(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during admin register:", error);
    res
      .status(400)
      .json({ error: "Username already taken. Please choose another name" });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("admin details: ", user);
    //  for testing
    // const testPassword = "123";
    // const storedHash =
    //   "$2b$10$UlhUpJUXXVmmZzCs7WjNmuZpRCGvRr1PkJI5UBsFkMwkf5scGA9du";
    // // Compare passwords
    // const matching = await bcrypt.compare(testPassword, storedHash);
    // console.log("Manual check: ", matching);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("is match", isMatch);
    if (user.role !== "admin") {
      return res.status(401).json({ error: "Not an admin" });
    }
    // console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // console.log(isMatch);
    // Generate token
    const token = generateToken(user._id);
    // console.log(token);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
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
  console.log("get all reports invoked");
  try {
    const reports = await Report.find();
    res.json(
      reports.map((report) => ({
        _id: report._id,
        title: report.title,
        category: report.category,
        status: report.status || "pending", // default fallback
        submittedAt: report.submittedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
};

export const getReport = async (req, res) => {
  console.log("get particular report invoked");
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    console.log("Encrypted content:", report.encryptedContent);

    if (!report.encryptedContent) {
      return res.status(400).json({ error: "Encrypted content missing" });
    }

    const decryptedContent = decrypt(report.encryptedContent);

    res.json({
      _id: report._id,
      title: report.title,
      category: report.category,
      status: report.status || "pending",
      submittedAt: report.submittedAt,
      content: decryptedContent,
    });
  } catch (error) {
    console.error("Error fetching the report:", error);
    res.status(500).json({ error: "Error fetching the report" });
  }
};
