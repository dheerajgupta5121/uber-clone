const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware.js');
const mapController = require('../Controller/mapsController.js');
const { query } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.auth,
    mapController.getCoordinates 
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.auth, 
    mapController.getDistanceTime
)

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.auth,
    mapController.getAutoCompleteSuggestions
)

module.exports = router;