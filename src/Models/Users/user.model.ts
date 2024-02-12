import mongoose, { Schema, ObjectId } from "mongoose";

export interface IUser {
  id?: string;
  password: string;
  email: string;
  fullName?: string;
  status?: string;
}

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "An email must be provided"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  status: {
    type: String,
    default: "unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const User = mongoose.model("User", userSchema);
