const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true, 
      sparse: true, // Allows null values, so it won't affect uniqueness of other fields
    },
    picture: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cafe",
      },
    ],
  },
);

// Middleware to update the updatedAt field on document save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = model("User", userSchema);

module.exports = User;
