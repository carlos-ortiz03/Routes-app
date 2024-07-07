"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaypoint = void 0;
const geolib_1 = require("geolib");
const directions = [0, 90, 180, 270]; // North, East, South, West
const getWaypoint = (origin, increment, direction) => {
    const waypoint = (0, geolib_1.computeDestinationPoint)(origin, increment * 1000, // Convert to meters
    direction);
    return { lat: waypoint.latitude, lng: waypoint.longitude };
};
exports.getWaypoint = getWaypoint;
