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
  location: 
    {
      city: { type: String, required: [true, "City is required."] },
      country: { type: String },
      address: { type: String, required: [true, "Address is required."] },
      lat: { type: Number, required: [true, "Latitude is required."] },
      lng: { type: Number, required: [true, "Longitude is required."] },
  },
  placeId: {
    type: String
  },
  specs: {
    type: [String],
    required: true,
    enum: [
      "Digital nomad friendly",
      "Good wifi",
      "Separate co-working space",
      "Parking available",
      "Air-conditioned",
      "Outdoor seating",
      "Comfy seating",
      "Best coffee in town",
      "Powerplugs at the table",
      "Quiet atmosphere",
      "Social spot",
      "Connecting community",
      "Brunch with the girlies"
    ]
  },
  food: {
    type: [String],
    enum: [
      "Pastries only",
      "Cakes and sweets",
      "Vegan only",
      "Healthy food",
      "Smoothie bowls",
      "Avocado toast",
      "Banana bread",
      "Local food",
      "International food",
      "Something for everyone",
      "Small selection",
      "Huge variety"
    ]
  },
  topPick: {
    type: [String],
    enum: [
      "working", 
      "bestCoffee",
      "socializing",
      "girliesBrunch",
      "localPlace",
      "sustainable"
    ]
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