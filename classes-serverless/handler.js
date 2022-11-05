const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());

const getYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  let academicYear = "";
  if (month < 7) {
    academicYear = `${year - 1}-${year}`;
  } else {
    academicYear = `${year}-${year + 1}`;
  }
  return academicYear;
};

const getSemester = () => {
  const date = new Date();
  const month = date.getMonth(); // Returns value between 0 and 11
  let semesterNum = 1;
  // If Current Month is before August return Sem 2 data else Sem 1 data
  if (month < 7) {
    semesterNum = 2;
  }
  return semesterNum;
};

app.get("/", async (req, res, next) => {
  if (!req.query.venue || !req.query.day) {
    console.log(req.query.venue);
    console.log(req.query.day);
    return res.status(400).json({
      error: "Missing either venue or day query parameters or both",
    });
  }

  const venue = req.query.venue.toUpperCase();
  const schoolDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const day = req.query.day.toLowerCase();
  if (!schoolDays.includes(day)) {
    return res.status(400).json({
      error: "Invalid school day",
    });
  }
  const academicYear = getYear();
  const semesterNum = getSemester();
  let venueRes = null;
  try {
    venueRes = await axios.get(
      `https://api.nusmods.com/v2/${academicYear}/semesters/${semesterNum}/venueInformation.json`
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }

  const venueData = venueRes.data;
  if (!venueRes || !venueData) {
    return res.status(404).json({
      error: "Could not find data",
    });
  }

  if (!venueData[venue]) {
    return res.status(404).json({
      error: "Could not find data",
    });
  }

  const venueObject = venueData[venue];
  const index = venueObject.findIndex((d) => d.day.toLowerCase() === day);
  if (index < 0) {
    return res.status(404).json({
      error: "Could not find data",
    });
  }

  let classes = [];
  if (venueObject[index] && venueObject[index].classes) {
    classes = venueObject[index].classes;
  }

  classes.sort((a, b) => a.startTime - b.startTime);
  return res.status(200).json({
    data: classes,
  });
});

app.get("/venues", async (req, res, next) => {
  const academicYear = getYear();
  const semesterNum = getSemester();
  try {
    const venues = await axios.get(
      `https://api.nusmods.com/v2/${academicYear}/semesters/${semesterNum}/venues.json`
    );
    const output = venues.data.sort((a, b) => a.localeCompare(b));
    return res.status(200).json({
      data: output,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/test", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from test",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
