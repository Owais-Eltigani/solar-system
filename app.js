const path = require('path');
require('dotenv').config();
const express = require('express');
const OS = require('os');
// const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

const PLANETS_SEED = [
    {
        name: "Sun",
        id: 0,
        description: "The Sun is the star at the center of our solar system.",
        image: "images/sun.png",
        velocity: "0 km/s",
        distance: "0 million km"
    },
    {
        name: "Mercury",
        id: 1,
        description: "Mercury is the smallest planet and the closest to the Sun.",
        image: "images/mercury.png",
        velocity: "47.87 km/s",
        distance: "57.9 million km"
    },
    {
        name: "Venus",
        id: 2,
        description: "Venus is the second planet from the Sun and is similar in size to Earth.",
        image: "images/venus.png",
        velocity: "35.02 km/s",
        distance: "108.2 million km"
    },
    {
        name: "Earth",
        id: 3,
        description: "Earth is our home planet and the only known world with life.",
        image: "images/earth.png",
        velocity: "29.78 km/s",
        distance: "149.6 million km"
    },
    {
        name: "Mars",
        id: 4,
        description: "Mars is known as the red planet and has the largest volcano in the solar system.",
        image: "images/mars.png",
        velocity: "24.07 km/s",
        distance: "227.9 million km"
    },
    {
        name: "Jupiter",
        id: 5,
        description: "Jupiter is the largest planet in our solar system and a gas giant.",
        image: "images/jupiter.png",
        velocity: "13.07 km/s",
        distance: "778.5 million km"
    },
    {
        name: "Saturn",
        id: 6,
        description: "Saturn is famous for its bright ring system made of ice and rock.",
        image: "images/saturn.png",
        velocity: "9.69 km/s",
        distance: "1433.5 million km"
    },
    {
        name: "Uranus",
        id: 7,
        description: "Uranus rotates on its side and is an ice giant with a pale blue color.",
        image: "images/uranus.png",
        velocity: "6.81 km/s",
        distance: "2872.5 million km"
    },
    {
        name: "Neptune",
        id: 8,
        description: "Neptune is the farthest known planet from the Sun and has strong winds.",
        image: "images/neptune.png",
        velocity: "5.43 km/s",
        distance: "4495.1 million km"
    }
];

function ensurePlanetsSeedData() {
    planetModel.find({}, { id: 1 }, function(findError, existingPlanets) {
        if (findError) {
            console.log("Error while reading planets collection", findError);
            return;
        }

        const existingIds = new Set(existingPlanets.map(function(planet) {
            return planet.id;
        }));

        const missingPlanets = PLANETS_SEED.filter(function(planet) {
            return !existingIds.has(planet.id);
        });

        if (missingPlanets.length === 0) {
            console.log("Planets collection already has default seed data.");
            return;
        }

        planetModel.insertMany(missingPlanets, function(seedError) {
            if (seedError) {
                console.log("Error while seeding planets data", seedError);
                return;
            }

            console.log("Seeded missing planets:", missingPlanets.map(function(planet) {
                return planet.name;
            }).join(", "));
        });
    });
}

mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("error!! " + err)
    } else {
        ensurePlanetsSeedData();
    }
})



app.post('/planet',   function(req, res) {
    const planetId = Number(req.body.id);

    if (Number.isNaN(planetId)) {
        return res.status(400).json({
            error: "Invalid planet id"
        });
    }

    planetModel.findOne({
        id: planetId
    }, function(err, planetData) {
        if (err) {
            console.log("Error in Planet Data", err);
            return res.status(500).json({
                error: "Error in Planet Data"
            });
        }

        if (!planetData) {
            return res.status(404).json({
                error: "Planet not found"
            });
        }

        return res.status(200).json(planetData);
    })
})

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => {
    console.log("Server successfully running on port - " +3000);
})


module.exports = app;