import Package from "../models/package.js";

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find(); // Fetch all packages
    res.json({ success: true, packages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
