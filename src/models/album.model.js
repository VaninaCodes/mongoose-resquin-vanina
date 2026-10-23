import { model, Schema } from "mongoose";

const albumSchema = new Schema({
  titulo: { type: String, required: true },
  fechaLanzamiento: { type: Date },
  version: { type: String },
});

export const AlbumModel = model("Album", albumSchema);
