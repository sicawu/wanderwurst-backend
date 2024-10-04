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
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  recommendation: String,
  location:
  {
    city: { type: String, required: [true, "City is required."] },
    country: { type: String, required: [true, "Country is required."] },
    address: { type: String, required: [true, "Address is required."] },
    lat: { type: Number, required: [true, "Latitude is required."] },
    lng: { type: Number, required: [true, "Longitude is required."] },
  },
  linkGoogleMaps: {
    type: String
  },
  placeId: {
    type: String
  },
  specs: {
    type: [String],
    enum: [
      "Digital nomad friendly",
      "Good wifi",
      "Co-working space",
      "Air-conditioned",
      "Outdoor seating",
      "Ergonomic seating",
      "Comfy seating",
      "Best coffee in town",
      "Powerplugs",
      "Quiet atmosphere",
      "Hosting workshops and events",
      "Selling local crafts",
      "Selling organic food",
      "Kids high chairs available",
      "Dog friendly"
    ]
  },
  food: {
    type: [String],
    enum: [
      "Pastries only",
      "Cakes and sweets",
      "Vegan only",
      "Vegan and vegetarian",
      "Pescetarian friendly",
      "Healthy food",
      "Local food",
      "International food",
      "Halal food",
      "Something for everyone",
      "Small food selection",
      "Huge dish variety",
      "Meat lovers heaven",
      "Smoothie bowls",
      "Avocado toast",
      "Banana bread",
      "Sandwich",
      "Pizza",
      "Pasta"
    ]
  },
  hungry: {
    type: Boolean,
    default: false
  },
  drinks: {
    type: [String],
    enum: [
      "Barista coffee",
      "Local coffee specialities",
      "Free drinking water",
      "Plant-based milk options",
      "Dairy milk only",
      "Fancy drinks",
      "Fresh juices",
      "Smoothies",
      "Kombucha",
      "Coconuts",
      "Alcoholic beverages"
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
  cafeSuggestions: [{
    type: String
  }],
  metaTitle: String,
  metaDescription: String,
  /*reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ], */
})

const Cafe = model("Cafe", cafeSchema)

module.exports = Cafe