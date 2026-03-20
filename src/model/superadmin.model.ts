import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: { provider?: string }) {
        return this.provider !== "google";
      }
    },
    provider: { type: String, default: "google" },
    role: { type: String, enum: ["SUPERADMIN"], default: "SUPERADMIN" },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const SuperAdmin = mongoose.model("superadmin", superAdminSchema);
SuperAdmin.createIndexes();

export {SuperAdmin};
