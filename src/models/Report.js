import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  encryptedContent: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-review", "resolved"],
    default: "pending",
  },
  submittedAt: { type: Date, default: Date.now },
});

// ✅ Virtual field for 'content' that sets encryptedContent
reportSchema.virtual("content").set(function (value) {
  console.log("Virtual setter content called with:", value);
  if (!value) throw new Error("Content is required");
  this.encryptedContent = encrypt(value);
});

// ✅ Method to decrypt when reading
reportSchema.methods.getDecryptedContent = function () {
  return decrypt(this.encryptedContent);
};

// Ensure virtuals are included if you use `.toObject()` or `.toJSON()` in the future
reportSchema.set("toObject", { virtuals: true });
reportSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Report", reportSchema);
