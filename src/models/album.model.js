import { model, Schema } from "mongoose";

const albumSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    fechaLanzamiento: { type: Date },
    version: { type: String, trim: true },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Funciona aunque Pc guarde un array de albumes
albumSchema.virtual("photocards", {
  ref: "Pc",
  localField: "_id",
  foreignField: "albumes",
});

export const AlbumModel = model("Album", albumSchema);
