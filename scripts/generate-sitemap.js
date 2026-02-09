const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const Cafe = require("../models/Cafe.model");

const DOMAIN = "https://sweetspots.world"; // DEINE DOMAIN

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Datenbankabfragen
    const cafes = await Cafe.find({}, "urlSlug");
    const cities = await Cafe.distinct("location.city");
    const topPicks = await Cafe.distinct("topPick");

    // XML Start
    let xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // ✅ Statische Seiten
    const pages = [
      "",           // Homepage
      "best-cafes", // Beste Cafés
      "random",     // Zufälliges Café
      "about",      // Über uns
      "login",      // Login
      "contact"     // Kontakt
    ];

    pages.forEach((page) => {
      xml += `
  <url>
    <loc>${DOMAIN}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>
  `;
    });

    // ✅ Dynamische Cafés
    cafes.forEach((cafe) => {
      xml += `
  <url>
    <loc>${DOMAIN}/cafes/${cafe.urlSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `;
    });

    // ✅ Städte-Seiten
    cities.forEach((city) => {
      const citySlug = city.toLowerCase().replace(/\s+/g, "-");
      xml += `
  <url>
    <loc>${DOMAIN}/best-cafes/city/${citySlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `;
    });

    // ✅ TopPick/Purpose-Seiten
    topPicks.forEach((pick) => {
      const pickSlug = pick.toLowerCase().replace(/\s+/g, "-");
      xml += `
  <url>
    <loc>${DOMAIN}/best-cafes/for/${pickSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `;
    });

    xml += "</urlset>";

    // ✅ Speichern im Frontend public-Ordner
    fs.writeFileSync("../wanderwurst-frontend/public/sitemap.xml", xml);

    console.log("✅ Sitemap.xml erfolgreich erstellt!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
