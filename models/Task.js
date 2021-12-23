const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    description: { type: String, sparse: true },
    file: { path: String, name: String },
    category: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
