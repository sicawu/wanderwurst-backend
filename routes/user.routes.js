const express = require('express');
const User = require('../models/User.model'); 
const Cafe = require('../models/Cafe.model'); 
const router = express.Router();

// POST: Register a new user
router.post("/register", async (req, res, next) => {
  console.log('Request Body:', req.body); // Log the request body
  const { email, name, googleId, picture } = req.body;

  try {
    // Check if the user already exists
    const foundUser  = await User.findOne({ email });
    if (foundUser ) {
      return res.status(400).json({ message: "User  already exists." });
    }

    // Create a new user
    const newUser  = await User.create({ email, name, googleId, picture });
    const user = { email: newUser .email, name: newUser .name };

    // Send a response with the user object
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error
    res.status(400).json({ error: error.message });
  }
});

// GET: Check if user exists
router.get("/check", async (req, res) => {
  const { googleId } = req.query; // Get googleId from query parameters

  try {
    const foundUser  = await User.findOne({ googleId });
    if (foundUser ) {
      return res.status(200).json({ exists: true, user: foundUser  });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET: Retrieve user's wishlist
router.get('/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId)

  try {
    const user = await User
    .findById(userId)
    .populate('wishlist'); // Populate wishlist with cafe data
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error retrieving wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Get user by Google ID and return their wishlist
router.get("/:id", async (req, res, next) => {
    const googleId = req.params.id; // Access the specific parameter 'id'

    try {
        const userDetails = await User.findOne({ googleId: googleId });
        if (!userDetails) {
            return res.status(404).json({ message: "User  not found" }); // Handle not found case
        }

        // Fetch cafes based on the urlSlugs in the user's wishlist
        const cafes = await Cafe.find({ urlSlug: { $in: userDetails.wishlist } });

        res.status(200).json({ ...userDetails.toObject(), wishlist: cafes }); // Return user details with populated wishlist
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});


{/*
router.get('/:id', async (req, res) => {
    const userGoogleId = req.params.id; // This is the internal ID
    try {
        // Fetch user from the database
        const user = await User.findById(userGoogleId).populate('wishlist'); // Populate to get cafe details
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.json({ wishlist: user.wishlist }); // Return the user's wishlist
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

{/*

// PUT: Update user information
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove user (optional)
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

*/}

module.exports = router;