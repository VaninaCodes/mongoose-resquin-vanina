import { model, Schema } from "mongoose";

//Subdoc embebido idol-perfil
const perfilSchema = new Schema(
  {
    nombreReal: {
      type: String,
      required: true,
      trim: true,
    },
    fechaNacimiento: { type: Date },
    posicion: { type: String },
    nacionalidad: { type: String },
  },
  { _id: false }, // evita que se cree un id separado
);

// 1:1 con perfil - 1:N con photocards
const idolSchema = new Schema(
  {
    nombreArtistico: { type: String, required: true, trim: true },
    grupo: { type: String, required: true, trim: true },
    activo: { type: Boolean, default: true },
    perfil: perfilSchema, // 1:1 embebida
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// Idol no guarda IDs de photocards, pero se pueden traer con populate virtual
idolSchema.virtual("photocards", {
  ref: "Pc",
  localField: "_id",
  foreignField: "idol",
});
idolSchema.virtual("contrato", {
  ref: "Contrato",
  localField: "_id",
  foreignField: "idol",
  justOne: true,
});

export const IdolModel = model("Idol", idolSchema);
