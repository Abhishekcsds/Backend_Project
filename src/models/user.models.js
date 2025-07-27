// Importing required packages
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // ❌ You had a typo: "jasonwebtoken"
import bcrypt from "bcrypt";

// Creating a new Mongoose schema for the User model
const userSchema = new mongoose.Schema({
  
    // Username field
    username: {
        type: String,
        required: true,
        unique: true,       // No two users can have the same username
        lowercase: true,    // Automatically converts to lowercase
        index: true,        // Makes searching faster
        trim: true          // Removes extra spaces
    },

    // Email field
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Full name field
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    // Avatar URL (from Cloudinary or other storage)
    avatar: {
        type: String,
        required: true
    },

    // Cover image is optional
    coverImage: {
        type: String
    },

    // Watch history: Array of video ObjectIds
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"  // References the "Video" collection
        }
    ],

    // Password (hashed)
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    // For storing refresh token in DB
    refreshToken: {
        type: String
    }

}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

// ------------------ 🔧 Pre-save Hook ------------------

// This runs before saving the document
userSchema.pre("save", async function (next) {
    // If the password is not modified, move to next middleware
    if (!this.isModified("password")) return next();

    // Hashing the password with salt rounds = 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



// ------------------ 🛠️ Custom Methods ------------------

// Compares user input password with hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};



// Generates JWT Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,   // Secret key from .env
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY  // You had a typo: `expirsIn` → `expiresIn`
        }
    );
};

// Generates JWT Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

// Exporting the User model
export const User = mongoose.model("User", userSchema);
