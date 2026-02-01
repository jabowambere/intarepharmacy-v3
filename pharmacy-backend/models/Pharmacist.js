import mongoose from "mongoose";

const pharmacistSchema = new mongoose.Schema({
    pharmacistName:{type:String, required:true, trim:true, unique:true},
    pharmacistEmail:{type:String, trim:true, default:""},
    pharmacistPhone:{type: String, trim: true, default: ""},
    pharmacistPassword:{type: String, required: true, min:0},
    pharmacistLicense:{type: Number, required: true, min:0, default:0},
}, {timestamps: true});

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);
export default Pharmacist;