import NPC from "../models/npc.js"; // Import the NPC model

//CRUD - Create Read Update Delete

// export const addFaculty = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const faculty = new facultyModel({ name });
//     await faculty.save();
//     res.json({ success: true, faculty });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const removeFaculty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await facultyModel.findByIdAndDelete(id);
//     res.json({ success: true, message: "Faculty removed" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getFaculties = async (req, res) => {
//   try {
//     const faculties = await facultyModel.find().populate("departments");
//     res.json({ success: true, faculties });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const addDepartmentToFaculty = async (req, res) => {
//   try {
//     const { facultyId } = req.params;
//     const { name } = req.body;

//     const department = new departmentModel({ name });
//     await department.save();

//     const faculty = await facultyModel
//       .findByIdAndUpdate(
//         facultyId,
//         { $push: { departments: department._id } },
//         { new: true }
//       )
//       .populate("departments");

//     res.json({ success: true, faculty });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const addNPC = async (req, res) => {
  try {
    const npcData = req.body;
    const npc = new NPC(npcData);
    await npc.save();
    res.json({ success: true, npc });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
