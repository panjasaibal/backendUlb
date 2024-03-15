const mongoose = require('mongoose');
const {Schema} = mongoose;

const superAdminSchema = new Schema(
    {
        username:{type:String, required:true},
        password:{type:String, required: true},
        timestamp:{type:String, default:Date.now}
    }
)

const SuperAdmin = mongoose.model('superadmin',superAdminSchema);
SuperAdmin.createIndexes();

module.exports = SuperAdmin;