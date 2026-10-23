import { body, param } from "express-validator";
import { AlbumModel } from "../../models/album.model.js";
import { validarCampos } from "../validarCampos.js";

export const crearAlbumValidator = [
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El título debe tener entre 2 y 100 caracteres")
    .custom(async (titulo, { req }) => {
      const existe = await AlbumModel.findOne({
        titulo,
        version: req.body.version,
        activo: true,
      });
      if (existe) throw new Error("Ya existe ese Album con esta versión");
    }),
  body("fechaLanzamiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida(AAAA-MM-DD)")
    .toDate(),
  body("version").optional().isString().isLength({ max: 50 }),
  validarCampos,
];

export const actualizarAlbumValidator = [
  param("id").isMongoId().withMessage("El ID no es válido"),
  body("titulo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El título debe tener entre 2 y 100 caracteres")
    .custom(async (titulo, { req }) => {
      const existe = await AlbumModel.findOne({
        titulo,
        version: req.body.version,
        activo: true,
      });
      if (existe) throw new Error("Ya existe ese Album con esta versión");
    }),
  body("fechaLanzamiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida(AAAA-MM-DD)")
    .toDate(),
  body("version").optional().isString().isLength({ max: 50 }),
  validarCampos,
];
