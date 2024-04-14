const mongoose = require('mongoose');
const {Schema} = mongoose;
const genrateTodayDate = require('../util/date.util.js');
const date = genrateTodayDate();

const StatusSchema = new Schema({
    worker:{type:mongoose.Schema.Types.ObjectId, ref:'workers',required:true},
    status: {type:String, required:true},
    date:{type:String, default:date},
    end_time: { type: Date, default: Date.now},
  });
  
  const Status = mongoose.model('status', StatusSchema);
  Status.createIndexes();
  
  module.exports = Status;