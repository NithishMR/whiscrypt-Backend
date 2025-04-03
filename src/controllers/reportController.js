import Report from "../models/Report.js";

export const submitReport = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newReport = await Report.create({ title, content });
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(
      reports.map((report) => ({
        title: report.title,
        content: report.getDecryptedContent(),
        submittedAt: report.submittedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
