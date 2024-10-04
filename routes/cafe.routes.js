const router = require("express").Router()
const mongoose = require("mongoose")
const Cafe = require("../models/Cafe.model.js")
const axios = require('axios')

const { isAuthenticated } = require("../middleware/jwt.middleware.js")
const GOOGLE_API_KEY_2 = process.env.GOOGLE_API_KEY_2   // For Google Opening Hours

{/*
//POST - USER NEEDS TO BE LOGGED IN
router.post("/cafes", /* isAuthenticated,(req, res, next) => {
  if (
    req.body.title === "" ||
    req.body.urlSlug === "" ||
    req.body.image === "" ||
    req.body.description === "" ||
    req.body.location.city === "" ||
    req.body.location.address === ""
  ) {
    res.status(401).json({ message: "Please enter all required fields." });
    return;
  }

  Cafe.create(req.body)
    .then((newCafe) => res.status(201).json(newCafe))
    .catch((err) => {
      next(err);
    });
});


//READ - LIST OF ALL CAFES
router.get("/cafes", (req, res, next) => {
  Cafe.find()
    /*.populate("reviews") // populate reviews
    .then((allCafes) => res.status(200).json(allCafes))
    .catch((err) => {
      next(err);
    })
})
*/}


// READ - GET CAFES WITH OPTIONAL FILTERS CITY + HUNGRY (FOR RANDOM PAGE)
router.get("/cafes", (req, res, next) => {
  const { city, hungry } = req.query;
  let query = {};

  if (city) {
    query["location.city"] = new RegExp(`^${city.replace(/-/g, ' ')}$`, 'i'); // Normalize city name
  }
  if (hungry) {
    query.hungry = hungry === 'true'; // Convert 'hungry' query param to boolean
  }

  Cafe.find(query)
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found for the selected criteria" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => next(err));
});


//READ - DETAILS OF ONE SPECIFIC CAFE
router.get("/cafes/:urlSlug", (req, res, next) => {
  Cafe.findOne({ urlSlug: req.params.urlSlug })
    /*.populate("reviews") // populate reviews */
    .populate("cafeSuggestions")
    .then((cafeDetails) => {
      if (!cafeDetails) {
        return res.status(404).json({ message: "Cafe not found" });  // Handle not found case
      }
      res.status(200).json(cafeDetails);
    })
    .catch((err) => {
      next(err)
    })
})

router.get("/suggestions", async (req, res, next) => {
  const { urlSlug } = req.query;
  if (!urlSlug) {
    return res.status(400).json({ message: "Cafe URL slug is required" });
  }

  try {
    const cafe = await Cafe.findOne({ urlSlug }).populate('cafeSuggestions');
    if (!cafe) {
      return res.status(404).json({ message: "Cafe not found" });
    }

    const transformedSuggestions = cafe.cafeSuggestions.map((suggestion) => ({
      title: suggestion.title,
      image: suggestion.image,
      urlSlug: suggestion.urlSlug,
      location: suggestion.location,
    }));

    res.status(200).json(transformedSuggestions);
  } catch (err) {
    next(err);
  }
});

// READ - LIST OF CAFES WITH ONE SPECIFIC TAG
router.get("/cafes/tag/:specs", (req, res, next) => {
  const formattedSpec = req.params.specs.replace(/-/g, ' ');  // Convert hyphens back to spaces
  console.log("Searching for cafes with spec:", formattedSpec);
  Cafe.find({ specs: { $in: [new RegExp(`^${formattedSpec}$`, 'i')] } })  // Case-insensitive search for cafes with the matching spec
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found with this spec" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => {
      next(err);
    });
})

// READ - LIST OF CAFES FOR ONE CITY
router.get("/cafes/city/:city", (req, res, next) => {
  const formattedCity = req.params.city.replace(/-/g, ' ').toLowerCase();  // Normalize city name
  console.log("Searching for cafes in city:", formattedCity);

  const cityQuery = {
    "location.city": new RegExp(`^${formattedCity}$`, 'i')
  }

   Cafe.find(cityQuery)
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found for this city with the selected specs" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => next(err));
})

// READ - LIST OF CAFES WITH ONE SPECIFIC PURPOSE/TOPPICK
router.get("/cafes/for/:toppick", (req, res, next) => {
  const formattedTopPick = req.params.toppick.replace(/-/g, ' ');  // Convert hyphens back to spaces
  console.log("Searching for cafes for following purpose:", formattedTopPick);
  Cafe.find({ topPick: { $in: [new RegExp(`^${formattedTopPick}$`, 'i')] } })  // Case-insensitive search for cafes with the matching spec
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found with this spec" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => {
      next(err);
    });
})

// READ - LIST OF CAFES WITH ONE SPECIFIC DRINK OPTION
router.get("/cafes/drinks/:drinks", (req, res, next) => {
  const drinks = decodeURIComponent(req.params.drinks);
  const formattedDrinks = req.params.drinks.replace(/-/g, ' '); 
  const drinksQuery = { drinks: { $in: [new RegExp(`^${formattedDrinks}$`, 'i')] } };
  Cafe.find({ $or: [drinksQuery] })
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found with this spec" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => {
      next(err);
    }); 
}) 

// READ - LIST OF CAFES WITH ONE SPECIFIC FOOD OPTION
router.get("/cafes/food/:food", (req, res, next) => {
  const formattedFood = req.params.food.replace(/-/g, ' '); 
  const foodQuery = { food: { $in: [new RegExp(`^${formattedFood}$`, 'i')] } };

  Cafe.find({ $or: [foodQuery] })
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found with this spec" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => {
      next(err);
    });
})

// READ - GET ALL EXISTING CITIES FOR HOMEPAGE
router.get("/cities", (req, res, next) => {
  Cafe.distinct("location.city")
    .then((cities) => {
      if (cities.length === 0) {
        return res.status(404).json({ message: "No cities found" });
      }
      res.status(200).json(cities);
    })
    .catch((err) => next(err));
})

// READ - GET ALL EXISTING SPECS FOR HOMEPAGE
router.get("/specs", (req, res, next) => {
  Cafe.distinct("specs")
    .then((specs) => res.json(specs))
    .catch(next);
})

// READ - GET ALL EXISTING TOPPICKS FOR HOMEPAGE
router.get("/topPick", (req, res, next) => {
  Cafe.distinct("topPick")
    .then((topPick) => {
      if (topPick.length === 0) {
        return res.status(404).json({ message: "No cities found" });
      }
      res.status(200).json(topPick);
    })
    .catch((err) => next(err));
})

// READ - GET ALL EXISTING FOOD OPTIONS FOR HOMEPAGE
router.get("/food", (req, res, next) => {
  Cafe.distinct("food")
    .then((food) => {
      if (food.length === 0) {
        return res.status(404).json({ message: "No cities found" });
      }
      res.status(200).json(food);
    })
    .catch((err) => next(err));
})

// READ - GET ALL EXISTING FOOD OPTIONS FOR HOMEPAGE
router.get("/drinks", (req, res, next) => {
  Cafe.distinct("drinks")
    .then((drinks) => {
      if (drinks.length === 0) {
        return res.status(404).json({ message: "No cities found" });
      }
      res.status(200).json(drinks);
    })
    .catch((err) => next(err));
})

// READ - GET ALL EXISTING CAFES WHERE HUNGRY IS TRUE
router.get("/hungry", (req, res, next) => {
  Cafe.find({ hungry : true })
    .then((cafes) => {
      if (cafes.length === 0) {
        console.log('Found cafes:', cafes);
        return res.status(404).json({ message: "There's no cafe for hungry people" })
      }
      res.status(200).json(cafes);
    })
    .catch((err) => next(err));
})

// READ - GET OPENING HOURS FOR ONE CAFE, BASED ON STORED PLACEID AND CONNECTION TO GOOGLE
router.get('/cafe-opening-hours/:placeId', async (req, res) => {
  const { placeId } = req.params;
  console.log(placeId)
  if (!placeId) {
    return res.status(400).json({ message: "Place ID is required" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${GOOGLE_API_KEY_2}`
    );
    console.log("API Response:", response.data);

    if (response.data.result && response.data.result.opening_hours) {
      res.json(response.data.result.opening_hours.weekday_text);
    } else {
      console.log("No opening hours found.");
      res.status(404).json({ message: "No opening hours available" });
    }
  } catch (error) {
    console.error("Error fetching opening hours:", error);
    res.status(500).json({ error: 'Error fetching opening hours' });
  }
})

//UPDATE - USER NEEDS TO BE LOGGED IN
router.put("/cafes/:cafeId", isAuthenticated, (req, res, next) => {
  Cafe.findByIdAndUpdate(req.params.cafeId, req.body, { new: true })
    .then((updatedCafe) => res.status(200).json(updatedCafe))
    .catch((err) => {
      next(err);
    });
  if (
    req.body.title === "" ||
    req.body.image === "" ||
    req.body.description === "" ||
    req.body.location.city === "" ||
    req.body.location.address === ""
  ) {
    res.status(401).json({ message: "Please enter all required fields." });
    return;
  }
});

//DELETE - USER NEEDS TO BE LOGGED IN
router.delete("/cafes/:cafeId", isAuthenticated, (req, res, next) => {
  Cafe.findByIdAndDelete(req.params.cafeId)
    .then(() => res.status(204).send())
    .catch((err) => {
      next(err);
    });
});

module.exports = router