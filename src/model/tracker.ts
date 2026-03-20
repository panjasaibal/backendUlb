import mongoose from "mongoose";
const {Schema} = mongoose;


const TrackSchema = new Schema({
    timestamp:{type:Date, default:Date.now},
    date:{type:String, default: Date.now},
    user_id:{type: mongoose.Schema.Types.ObjectId, required: true},
    model:{type:String, enum:['workers','supervisor'], default:'supervisor', required:true},
    address:{type:String, default: ""},
    latitude:{type:Number},
    longitude:{type:Number}
}, {
    timestamps: true
});

const Tracker = mongoose.model('tracker', TrackSchema);
Tracker.createIndexes();

module.exports = Tracker;
