import PackageDetail from "../models/packageDetail.js";

export const getPackageDetails = async (req, res) => {
  try {
    const packageDetails = await PackageDetail.find(); // Fetch all package details
    res.json({ success: true, packageDetails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
