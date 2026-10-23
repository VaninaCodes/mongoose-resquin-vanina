import mongoose, { model, Schema } from "mongoose";

// pc: photocard
const pcSchema = new Schema({
  nombre: { type: String, require: true },
  imagenUrl: { type: String },
  rareza: {
    type: String,
    enum: ["Común", "Rara", "Benefit", "Broadcast"],
    default: "Común",
  },
  // 1:N un idol puede tener muchas photocards pero en una photocard esta solo un idol
  idol: {
    type: Schema.Types.ObjectId,
    ref: "Idol",
    required: true,
  },
  // N:M una photocard puede estar en varios álbumes (ediciones especiales, re-lanzamientos)
  albumes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
});

export const PcModel = model("Pc", pcSchema);
