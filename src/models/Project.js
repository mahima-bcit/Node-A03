const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true } },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    path: String,
    alt: String,
    type: String, // cover/screenshot
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // A03 required
    isActive: { type: Boolean, required: true },
    tags: { type: [tagSchema], default: [] },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Optional but keeps your A02 UI working
    tagline: { type: String, default: "" },
    stack: { type: [String], default: [] },
    images: { type: [imageSchema], default: [] },
    dates: {
      created: String,
      updated: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema, "projects");