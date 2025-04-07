import Location from "../models/location.js";

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find(); // Fetch all locations
    res.json(locations);
  } catch (error) {
    res.json({ message: error.message });
  }
};
