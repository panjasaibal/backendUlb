const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkersSchema = new Schema({
  admin:{type:mongoose.Schema.Types.ObjectId, ref:'adminstration',required:true},
  name: {type:String, required:true}, // String is shorthand for {type: String}
  phone: {type:String, required:true, unique:true},
  address: {type:String, default:"null"},
  latitude:{type:String,default:"null"},
  longitude:{type:String,default:"null"},
  status:{type:String, default:'offline'}, 
  timestamp: { type: Date, default: Date.now },
});

const Worker = mongoose.model('workers', WorkersSchema);
Worker.createIndexes();
module.exports = Worker;