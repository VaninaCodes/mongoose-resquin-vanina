import mongoose, { model, Schema } from "mongoose";

// pc: photocard
const pcSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    imagenUrl: { type: String },
    rareza: {
      type: String,
      enum: ["Común", "Rara", "Benefit", "Broadcast"],
      default: "Común",
    },
    idol: { type: Schema.Types.ObjectId, ref: "Idol", required: true }, // 1:N
    albumes: [{ type: Schema.Types.ObjectId, ref: "Album" }], // N:M
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PcModel = model("Pc", pcSchema);
