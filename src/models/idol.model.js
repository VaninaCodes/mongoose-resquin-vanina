import { model, Schema } from "mongoose";

//Subdoc embebido idol-perfil
const perfilSchema = new Schema(
  {
    nombreReal: {
      type: String,
      require: true,
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
    nombreArtistico: { type: String, require: true },
    grupo: { type: String, require: true },
    activo: { type: Boolean, default: true },
    perfil: perfilSchema, // 1:1 embebida
  },
  { timestamps: true },
);

export const IdolModel = model("Idol", idolSchema);
