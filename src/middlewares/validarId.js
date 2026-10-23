import { param } from "express-validator";
import { validarCampos } from "./validarCampos.js";

export const validarIdParam = [
  param("id")
    .isMongoId()
    .withMessage("El ID no es un ObjectId válido", validarCampos),
];
