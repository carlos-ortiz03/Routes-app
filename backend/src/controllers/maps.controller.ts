import { Request, Response } from "express";
import axios from "axios";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
console.log("Google Maps API key loaded successfully:", apiKey);

export const getDirections = async (req: Request, res: Response) => {
  const { origin, destination } = req.query;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          key: apiKey,
          alternatives: true, // Ensure this parameter is included
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching directions from Google Maps API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching directions" });
  }
};
