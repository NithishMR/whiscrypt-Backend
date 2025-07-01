import Report from "../models/Report.js";

export const submitReport = async (req, res) => {
  console.log("submit report reached");
  try {
    const { title, content, category } = req.body;
    console.log(title, content, category);

    // Create and use virtual to set encryptedContent
    const newReport = new Report({ title, category, status: "pending" });
    newReport.content = content; // Triggers virtual setter (encrypts it)
    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
