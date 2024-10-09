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
      "Digital Nomad-friendly",
      "Good Wifi",
      "Separate Co-working Space",
      "Air-conditioned",
      "Cosy Atmosphere",
      "Outdoor Seating",
      "Ergonomic Seating",
      "Best Coffee in Town",
      "Powerplugs",
      "Quiet Atmosphere",
      "Hosting Workshops and Events",
      "Selling Local Crafts",
      "Selling Organic TA-Food",
      "Kids High Chairs available",
      "Dog-friendly"
    ]
  },
  food: {
    type: [String],
    enum: [
      "Pastries only",
      "Cakes and Sweets",
      "Vegan only",
      "Vegan and vegetarian",
      "Pescetarian friendly",
      "Healthy Food",
      "Local Food",
      "International Food",
      "Halal Food",
      "Something for Everyone",
      "Small Bites",
      "Meat Lovers Heaven",
      "Smoothie Bowls",
      "Poke Bowls",
      "Avocado Toast",
      "Banana Bread",
      "Sushi",
      "Sandwiches",
      "Pizza",
      "Pasta",
      "Burger"
    ]
  },
  hungry: {
    type: Boolean,
    default: false
  },
  drinks: {
    type: [String],
    enum: [
      "Barista Coffee",
      "Local Coffee Specialities",
      "Free Drinking Water",
      "Plant-based milk options",
      "Dairy milk only",
      "Fancy Drinks",
      "Fresh Juices",
      "Smoothies",
      "Kombucha",
      "Coconuts",
      "Alcoholic Beverages"
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