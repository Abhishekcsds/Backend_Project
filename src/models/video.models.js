// Import Mongoose and the pagination plugin
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the video schema
const videoSchema = new mongoose.Schema({

    // URL of the video file (stored on Cloudinary or similar)
    videoFile: {
        type: String,
        required: true
    },

    // Thumbnail image URL
    thumbinal: {
        type: String,
        required: true
    },

    // Video title
    title: {
        type: String,
        required: true
    },

    // Video description
    description: {
        type: String,
        required: true
    },

    // Duration of the video in seconds (or minutes)
    duration: {
        type: Number,
        required: true
    },

    // Number of views the video has
    views: {
        type: Number,
        default: 0   // Starts with 0 views
    },

    // Whether the video is published (visible to users)
    isPublished: {
        type: Boolean,
        default: true
    },

    // Reference to the user who uploaded the video
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // Links to the User model
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// 📌 Apply pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate);

// ✅ Export the Video model
export const Video = mongoose.model("Video", videoSchema);
