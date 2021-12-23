const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: Number, required: true, unique: true },
    password: { type: String },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
