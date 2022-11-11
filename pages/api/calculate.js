import NextCors from "nextjs-cors";
import { Origin, Horoscope } from "circular-natal-horoscope-js";
import countries from "../../list.json";

// Request Handler Function
export default async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { year, month, day, hour, min, countryID } = req.body;

  const a = new Origin({
    year: parseInt(year, 10),
    month: parseInt(month - 1, 10), // 0 = January, 11 = December!
    date: parseInt(day, 10),
    hour: parseInt(hour, 10),
    minute: parseInt(min, 10),
    latitude: countries[countryID].FIELD2,
    longitude: countries[countryID].FIELD3,
  });
  const customOrbs = {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 7,
    sextile: 6,
    quincunx: 5,
    quintile: 1,
    septile: 1,
    "semi-square": 1,
    "semi-sextile": 1,
  };
  const horoscope = new Horoscope({
    origin: a,
    houseSystem: "whole-sign",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major", "minor"],
    customOrbs: customOrbs,
    language: "en",
  });

  res
    .status(200)
    .json([
      horoscope.CelestialBodies.sun.Sign.label,
      horoscope.CelestialBodies.moon.Sign.label,
      horoscope.Angles.ascendant.Sign.label,
    ]);
};
