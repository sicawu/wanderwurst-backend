const { Schema, model } = require("mongoose")

const cafeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    unique: true,
  },
  urlSlug: {
    type: String,
    required: [true, "URL is required."],
    unique: true,
  },
  image: {
    type: String,
    required: [true, "Image is required."],
  },
  imageAlt: {
    type: String
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  location: [
    {
      city: { type: String, required: [true, "City is required."] },
      country: { type: String },
      address: { type: String, required: [true, "Address is required."] },
      lat: { type: Number, required: [true, "Latitude is required."] },
      lng: { type: Number, required: [true, "Longitude is required."] },
    },
  ],
  specs: {
    type: [String], // Array of strings for specs
    required: true,
  },
  placeId: {
    type: String
  },
  metaTitle: String,
  metaDescription: String,

  /*reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ], */
});

const Cafe = model("Cafe", cafeSchema)

module.exports = Cafe