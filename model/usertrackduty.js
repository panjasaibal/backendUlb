const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserTrackSchema = new Schema({
    date:{type:String,default: Date.now},
    worker:{type: mongoose.Schema.Types.ObjectId, ref:'workers', required: true},
    latitude:{type:String },
    longitude:{type:String},
    start_time:{type:Date, default:Date.now},
    end_time:{type:Date}
})

const UserTrackDuty = mongoose.model('usertrackduty', UserTrackSchema);
UserTrackDuty.createIndexes();

module.exports = UserTrackDuty;
