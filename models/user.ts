import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

import mongoose from "mongoose";

interface IUser {
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  password?: string;
  passwordHash?: string;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    passwordHash: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      max: 50,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
    methods: {
      generateAuthToken: function (expiresIn = "1m") {
        const token: string = jwt.sign(
          {
            _id: this._id,
            role: this.role,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
          },
          process.env.JWT_SECRET!,
          { expiresIn: expiresIn, algorithm: "HS256" }
        );
        return token;
      },

      comparePassword: async function (candidatePassword: string) {
        const hash = createHash("sha256")
          .update(candidatePassword)
          .digest("hex");
        return hash === this.passwordHash;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  console.log("pre save");
  const user = this as IUser;
  if (user.password) {
    const hash = createHash("sha256").update(user.password).digest("hex");
    user.passwordHash = hash;
    console.log("Hashed password:", hash);
  } else {
    console.error("Error: Password is undefined or null");
  }
  //   const hash = createHash("sha256").update(user.password).digest("hex");
  next();
});
const User = mongoose.model("Users", userSchema);
export default User;
export { IUser };
