const mongoose = require('mongoose');
const { Schema } = mongoose;

const DutySchema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    worker:{type:mongoose.Schema.Types.ObjectId, ref:'workers', required:true},
    duration:{type:String, default:"0"},
    completed:{type:Boolean, default:false},
    date:{type:Date, default:Date.now},
    endtime:{type:Date},
    latitude:{type:String,default:"null"},
    longitude:{type:String,default:"null"}
  });
  
  const Duty = mongoose.model('duty', DutySchema);
  Duty.createIndexes();
  module.exports = Duty;