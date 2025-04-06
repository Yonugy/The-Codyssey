import Location from "../models/location.js";

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find(); // Fetch all locations
    res.json({ success: true, locations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
