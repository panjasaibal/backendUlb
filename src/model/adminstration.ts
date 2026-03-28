import mongoose from "mongoose";

const AdminsSchema = new mongoose.Schema(
  {
    superadmin: { type: mongoose.Schema.Types.ObjectId, ref: "superadmin", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    access: { type: Boolean, default: false },
    profileComplete: { type: Boolean, default: false },
    role: { type: String, enum: ["ADMIN", "SUPERADMIN"], default: "ADMIN" },
    inviteToken:{type:String, required: true },
    inviteExpires:{type: Date, required: true},
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE"],
      default: "PENDING"
    },
    subscription: { type: String, default: "FREE" },
    createdAt:{type:Date, default: Date.now},
    updatedAt:{type:Date, default: Date.now},
  },
  {
    timestamps: true
  }
);

const Adminstration = mongoose.model("adminstration", AdminsSchema);
Adminstration.createIndexes();


export {Adminstration};
