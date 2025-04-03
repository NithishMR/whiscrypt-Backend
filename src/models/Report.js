import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  encryptedContent: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Encrypt content before saving
reportSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.encryptedContent = encrypt(this.content);
    this.content = undefined; // Remove plaintext content
  }
  next();
});

// Decrypt content when retrieving
reportSchema.methods.getDecryptedContent = function () {
  return decrypt(this.encryptedContent);
};

export default mongoose.model("Report", reportSchema);
