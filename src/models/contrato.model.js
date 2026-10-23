import { model, Schema } from "mongoose";

const contratoSchema = new Schema(
  {
    idol: {
      type: Schema.Types.ObjectId,
      ref: "Idol",
      required: true,
      unique: true,
    }, // 1:1
    agencia: { type: String, required: true, trim: true },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ContratoModel = model("Contrato", contratoSchema);
