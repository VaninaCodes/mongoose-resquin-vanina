import { body, param } from "express-validator";
import { ContratoModel } from "../../models/contrato.model.js";
import { IdolModel } from "../../models/idol.model.js";
import { validarCampos } from "../validarCampos.js";

export const crearContratoValidator = [
  body("idol")
    .notEmpty()
    .withMessage("El idol es obligatorio")
    .isMongoId()
    .withMessage("ID de idol inválido")
    .bail()
    .custom(async (idol) => {
      const existeIdol = await IdolModel.findOne({ _id: idol, activo: true });
      if (!existeIdol) throw new Error("El idol no existe");

      // 1:1: un idol no puede tener dos contratos activos
      const yaTiene = await ContratoModel.findOne({ idol, activo: true });
      if (yaTiene) throw new Error("Ese idol ya tiene un contrato");
    }),
  body("agencia")
    .trim()
    .notEmpty()
    .withMessage("La agencia es obligatoria")
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),
  body("fechaInicio")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida (AAAA-MM-DD)")
    .toDate(),
  body("fechaFin")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida (AAAA-MM-DD)")
    .toDate()
    .custom((fechaFin, { req }) => {
      if (req.body.fechaInicio && fechaFin < new Date(req.body.fechaInicio)) {
        throw new Error("La fecha de fin no puede ser anterior a la de inicio");
      }
      return true;
    }),
  validarCampos,
];

// En el PUT no se valida "idol": así matchedData lo descarta y no se puede cambiar de dueño
export const actualizarContratoValidator = [
  param("id").isMongoId().withMessage("El ID no es un ObjectId válido"),
  body("agencia").optional().trim().notEmpty().isLength({ max: 100 }),
  body("fechaInicio").optional().isISO8601().toDate(),
  body("fechaFin")
    .optional()
    .isISO8601()
    .toDate()
    .custom((fechaFin, { req }) => {
      if (req.body.fechaInicio && fechaFin < new Date(req.body.fechaInicio)) {
        throw new Error("La fecha de fin no puede ser anterior a la de inicio");
      }
      return true;
    }),
  validarCampos,
];
