import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.AES_SECRET_KEY;
const IV_LENGTH = 16;

export const encrypt = (text) => {
  // console.log(SECRET_KEY);
  // if (!SECRET_KEY) throw new Error("AES_SECRET_KEY env variable not set");

  if (!text) throw new Error("Nothing to encrypt");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text) => {
  const [iv, encryptedData] = text.split(":");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.from(iv, "hex")
  );
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "hex")),
    decipher.final(),
  ]).toString();
};
