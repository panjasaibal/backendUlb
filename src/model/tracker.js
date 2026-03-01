const mongoose = require('mongoose');
const {Schema} = mongoose;
const genrateTodayDate = require('../util/date.util.js');

let date = genrateTodayDate();
const TrackSchema = new Schema({
    timestamp:{type:String, default:Date.now},
    date:{type:String,default: date},
    user_id:{type: mongoose.Schema.Types.ObjectId, required: true},
    model:{type:String, enum:['workers','supervisor'], default:'supervisor', required:true},
    address:{type:String, default: ""},
    latitude:{type:String},
    longitude:{type:String}
})

const Tracker = mongoose.model('tracker', TrackSchema);
Tracker.createIndexes();

module.exports = Tracker;