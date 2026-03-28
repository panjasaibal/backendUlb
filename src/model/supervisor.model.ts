import mongoose from "mongoose";
const { Schema } = mongoose;

const SuperVisorSchema = new Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminstration",
      required: true,
    },
    name: { type: String, required: true }, // String is shorthand for {type: String}
    phone: { type: String, required: true, unique: true },
    address: { type: String, default: null },
    profile: { type: String, default: null },
    adhar: { type: String, default: null, require: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const SuperVisor = mongoose.model("supervisor", SuperVisorSchema);
SuperVisor.createIndexes();

export { SuperVisor };
