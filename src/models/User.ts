import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

export const User = mongoose.models.users || mongoose.model("users", userSchema);



// import { models, model, Schema } from "mongoose";

// const UserSchema = new Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   image: { type: String },
// }, { timestamps: true });

// export const User = models?.User || model('User', UserSchema);

