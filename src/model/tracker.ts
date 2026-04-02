import mongoose from "mongoose";
const {Schema} = mongoose;


const TrackSchema = new Schema({
    timestamp:{type:Date, default:Date.now},
    date:{type:String, default: Date.now},
    user_id:{type: mongoose.Schema.Types.ObjectId, required: true},
    role:{type:String, enum:['Worker' ,'Supervisor'], default:'supervisor', required:true},
    address:{type:String, default: ""},
    latitude:{type:Number},
    longitude:{type:Number},
    createdAt:{type: String, default: Date.now}
}, {
    timestamps: true
});

const Tracker = mongoose.model('tracker', TrackSchema);
Tracker.createIndexes();

export { Tracker };
