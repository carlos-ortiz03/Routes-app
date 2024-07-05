// controllers/routes.controller.ts
import { Request, Response } from "express";
import Route from "../models/route.model";
import { IRoute } from "../models/route.model";
import { CustomRequest } from "../utils/verifyUser";

export const saveRoute = async (req: CustomRequest, res: Response) => {
  try {
    const { name, distance, geometry, travelMode } = req.body;
    const userId = req.user!.id; // User ID is extracted from the token

    console.log("Saving route with data:", {
      name,
      distance,
      geometry,
      travelMode,
      userId,
    });

    // Ensure geometry.coordinates is an array of arrays of numbers
    if (
      !Array.isArray(geometry.coordinates) ||
      !Array.isArray(geometry.coordinates[0])
    ) {
      throw new Error("Invalid geometry coordinates");
    }

    const newRoute: IRoute = new Route({
      name,
      distance,
      geometry,
      travelMode,
      user: userId,
    });

    await newRoute.save();
    console.log("hi");
    res.status(201).json({ message: "Route saved successfully!" });
  } catch (error) {
    console.error("Error saving route:", error); // Log the error to the server console
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getRoutes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const routes = await Route.find({ user: userId });
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error); // Log the error to the server console
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteRoute = async (req: CustomRequest, res: Response) => {
  try {
    const routeId = req.params.id;
    const userId = req.user!.id;

    const route = await Route.findOneAndDelete({ _id: routeId, user: userId });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error); // Log the error to the server console
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const editRoute = async (req: CustomRequest, res: Response) => {
  try {
    const routeId = req.params.id;
    const userId = req.user!.id;
    const { name } = req.body;

    const route = await Route.findOneAndUpdate(
      { _id: routeId, user: userId },
      { name },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({ message: "Route updated successfully", route });
  } catch (error) {
    console.error("Error updating route:", error); // Log the error to the server console
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
