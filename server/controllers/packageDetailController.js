import PackageDetail from "../models/package_detail.js";

export const getPackageDetails = async (req, res) => {
  try {
    const packageDetails = await PackageDetail.find(); // Fetch all package details
    res.json({ success: true, packageDetails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
