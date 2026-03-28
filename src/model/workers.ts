import mongoose from 'mongoose';
const { Schema } = mongoose;

const WorkersSchema = new Schema({
  admin:{type:mongoose.Schema.Types.ObjectId, ref:'adminstration',required:true},
  supervisor:{type:mongoose.Schema.Types.ObjectId, ref:'supervisor', required:true},
  name: {type:String, required:true}, // String is shorthand for {type: String}
  phone: {type:String, required:true, unique:true},
  address: {type:String, default:null},
  adhar:{type:String, default:null},
  createdAt:{type: Date, default: Date.now},
  updatedAt:{type: Date, default: Date.now},
}, {
  timestamps: true
});

const Worker = mongoose.model('workers', WorkersSchema);
Worker.createIndexes();
export { Worker };
