const mongoose = require('mongoose');
const {Schema} = mongoose;
const genrateTodayDate = require('../util/date.util.js');

let date = genrateTodayDate();
const TrackSchema = new Schema({
    timestamp:{type:String, default:Date.now},
    date:{type:String,default: date},
    worker:{type: mongoose.Schema.Types.ObjectId, ref:'workers', required: true},
    latitude:{type:String},
    longitude:{type:String}
})

const Tracker = mongoose.model('tracker', TrackSchema);
Tracker.createIndexes();

module.exports = Tracker;