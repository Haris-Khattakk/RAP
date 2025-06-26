const mongoose = require("mongoose");
const User = require("./userModel");
const comment = require("./commentModel");
const like = require("./likesModel");
const disLike = require("./disLikeModel");
const media = require("./mediaModel");

const postSchema = mongoose.Schema(
  {
    title: String,
    propertyType: String,
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "like",
      },
    ],
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "disLike",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
