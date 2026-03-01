import mongoose from "mongoose";

const AdminsSchema = new mongoose.Schema({
  superadmin:{type:mongoose.Schema.Types.ObjectId, ref:'superadmin',required:true},
  name: {type:String, required:true}, // String is shorthand for {type: String}
  email: {type:String, required:true, unique:true},
  role: { type: String, default: "ADMIN" },
  subscription: { type: String, default: "FREE" },
  timestamp: { type: Date, default: Date.now},
});

const Adminstration = mongoose.model('adminstration', AdminsSchema);
Adminstration.createIndexes();


export {Adminstration};