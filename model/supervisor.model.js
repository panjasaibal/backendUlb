const mongoose = require('mongoose');
const { Schema } = mongoose;

const SuperVisorSchema = new Schema({
    admin:{type:mongoose.Schema.Types.ObjectId, ref:'adminstration',required:true},
    name: {type:String, required:true}, // String is shorthand for {type: String}
    phone: {type:String, required:true, unique:true},
    address: {type:String, default:"null"},
    profile:{type:String, default:"null"},
    adhar:{type:String, default:"null"},
    status:{type:String, default:'offline'}, 
    timestamp: { type: Date, default: Date.now },
  });
  
  const SuperVisor = mongoose.model('supervisor', SuperVisorSchema);
  SuperVisor.createIndexes();
  module.exports = SuperVisor;