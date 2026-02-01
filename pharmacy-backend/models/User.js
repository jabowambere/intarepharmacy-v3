import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{type: String, required:true, trim:true},
    email:{type: String, required:true, unique:true, lowercase:true, trim:true},
    password:{type:String, required:true},
    phone:{type:String},
    license:{type:String},
    role:{type:String, enum:["admin", "pharmacist"], default: "pharmacist"},
}, {timestamps: true});

//comparing passwords
userSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;