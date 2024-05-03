const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const genarateTodayDate = require('../util/date.util');
const { Schema } = mongoose;

const date = genarateTodayDate();
const DutySchema = new Schema({
    duty_name:{type:String, required:true},
    description:{type:String, required:true},
    place:{type:String},
    supervisor:{type:mongoose.Schema.Types.ObjectId, ref:'supervisor', required:true},
    workers:{type:Array, required:true},
    completed:{type:Boolean, default:false},
    date:{type:String, default:date},
    endtime:{type:Date},
    image:{type:String},
    timestamp:{type:Date,default:Date.now},
  });
  
  const Duty = mongoose.model('duty', DutySchema);
  Duty.createIndexes();
  module.exports = Duty;