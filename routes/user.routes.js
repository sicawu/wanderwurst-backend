const express = require('express');
const User = require('../models/User.model'); // Adjust the path as necessary
const router = express.Router();

// POST: Register a new user
router.post("/register", async (req, res, next) => {
  console.log('Request Body:', req.body); // Log the request body
  const { email, name, googleId } = req.body;

  try {
    // Check if the user already exists
    const foundUser  = await User.findOne({ email });
    if (foundUser ) {
      return res.status(400).json({ message: "User  already exists." });
    }

    // Create a new user
    const newUser  = await User.create({ email, name, googleId });
    const user = { email: newUser .email, name: newUser .name };

    // Send a response with the user object
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error
    res.status(400).json({ error: error.message });
  }
});


    // GET: Fetch user profile
    router.get('/:id', async (req, res) => {
      try {
        const user = await User.findById(req.params.id).populate('wishlist');
        if (!user) {
          return res.status(404).json({ message: 'User  not found' });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

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

module.exports = router;