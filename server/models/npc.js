// import mongoose from "mongoose";

// const performanceCategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
// });


// export default performanceCategoryModel;

import mongoose from "mongoose";

const AnimationSchema = new mongoose.Schema({
  startFrame: Number,
  endFrame: Number,
  frameRate: Number,
  repeat: Number,
});

const NPCSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["image", "spritesheet"] },
  img: { type: String, required: true },
  scale: { type: Number, required: true },
  frameSize: {
    width: { type: Number, required: function () { return this.type === "spritesheet"; } },
    height: { type: Number, required: function () { return this.type === "spritesheet"; } },
  },
  animation: {
    type: Map,
    of: AnimationSchema,
    required: function () { return this.type === "spritesheet"; },
  },
  initialFrame: { type: Number, required: function () { return this.type === "spritesheet"; } },
});

const NPC = mongoose.model("NPC", NPCSchema);

export default NPC;
