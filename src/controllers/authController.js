import User from "../models/User.js";
import generateToken from "../utils/jwt.js"; // Correct import
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //  for testing
    // const testPassword = "123";
    // const storedHash =
    //   "$2b$10$UlhUpJUXXVmmZzCs7WjNmuZpRCGvRr1PkJI5UBsFkMwkf5scGA9du";
    // // Compare passwords
    // const matching = await bcrypt.compare(testPassword, storedHash);
    // console.log("Manual check: ", matching);
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
