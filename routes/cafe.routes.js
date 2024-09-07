const router = require("express").Router()
const mongoose = require("mongoose")
const Cafe = require("../models/Cafe.model.js")

const { isAuthenticated } = require("../middleware/jwt.middleware.js")

//POST - USER NEEDS TO BE LOGGED IN
router.post("/cafes", /* isAuthenticated,*/ (req, res, next) => {

  console.log(req.body);

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
    /*.populate("reviews") // populate reviews */
    .then((allCafes) => res.status(200).json(allCafes))
    .catch((err) => {
      next(err);
    });
});

//READ - LIST OF ONE SPECIFIC CAFE
router.get("/cafes/:urlSlug", (req, res, next) => {
  Cafe.findOne({ urlSlug: req.params.urlSlug })
    /*.populate("reviews") // populate reviews */
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

  Cafe.find({
    "location.city": new RegExp(`^${formattedCity}$`, 'i')  // Case-insensitive search
  })
    .then((cafes) => {
      if (cafes.length === 0) {
        return res.status(404).json({ message: "No cafes found in this city" });
      }
      res.status(200).json(cafes);
    })
    .catch((err) => next(err));
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
    req.body.location[0].city === "" ||
    req.body.location[0].address === ""
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