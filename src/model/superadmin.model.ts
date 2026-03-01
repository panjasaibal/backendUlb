import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
    {
        username:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required: true},
        provider: { type: String, default: "google" },
        role: { type: String, default: "SUPERADMIN" },
        timestamp:{type:String, default:Date.now}
    }
)

const SuperAdmin = mongoose.model('superadmin',superAdminSchema);
SuperAdmin.createIndexes();

export {SuperAdmin};