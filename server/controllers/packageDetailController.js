import PackageDetail from "../models/package_detail.js";

export const getPackageDetails = async (req, res) => {
  try {
    const packageDetails = await PackageDetail.find(); // Fetch all package details
    res.json(packageDetails);
  } catch (error) {
    res.json({ message: error.message });
  }
};
