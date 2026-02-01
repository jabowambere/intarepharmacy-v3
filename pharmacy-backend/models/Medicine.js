import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true, unique:true},
    description:{type:String, trim:true, default:""},
    image:{type: String, trim: true, default: ""},
    price:{type: Number, required: true, min:0},
    quantity:{type: Number, required: true, min:0, default:0},
}, {timestamps: true});

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;