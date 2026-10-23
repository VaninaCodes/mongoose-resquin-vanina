import { body, param } from "express-validator";
import { IdolModel } from "../../models/idol.model.js";
import { validarCampos } from "../validarCampos.js";

export const crearIdolValidator = [
  body("nombreArtistico")
    .trim()
    .notEmpty()
    .withMessage("El nombre artístico es obligatorio")
    .isLength({ max: 50 })
    .withMessage("Máximo 50 caracteres")
    .custom(async (nombreArtistico) => {
      const existe = await IdolModel.findOne({ nombreArtistico, activo: true });
      if (existe) throw new Error("Ya existe un idol con ese nombre artístico");
    }),
  body("grupo")
    .trim()
    .notEmpty()
    .withMessage("El grupo es obligatorio")
    .isLength({ max: 50 })
    .withMessage("Máximo 50 caracteres"),

  // campos de la propiedad embebida
  body("perfil")
    .optional()
    .isObject()
    .withMessage("El perfil debe ser un objeto"),
  body("perfil.nombreReal")
    .if(body("perfil").exists())
    .trim()
    .notEmpty()
    .withMessage("El nombre real es obligatorio si enviás perfil")
    .isLength({ max: 100 }),
  body("perfil.fechaNacimiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida(AAAA-MM-DD)")
    .toDate(),
  body("perfil.posicion").optional().isString().isLength({ max: 50 }),
  body("perfil.nacionalidad").optional().isString().isLength({ max: 50 }),
  validarCampos,
];

export const actualizarIdolValidator = [
  param("id").isMongoId().withMessage("El ID no es válido"),
  body("nombreArtistico")
    .optional().trim()
    .notEmpty()
    .isLength({ max: 50 })
    .custom(async (nombreArtistico, { req }) => {
      const existe = await IdolModel.findOne({
        nombreArtistico,
        activo: true,
        // selecciona todos los doc con distinto _id al que ingresa (ne: no igual)
        _id: { $ne: req.params.id },
      });
      if (existe) throw new Error("Ya existe un idol con ese nombre artístico");
    }),
  body("grupo").optional().trim().notEmpty().isLength({ max: 50 }),

  // campos de la propiedad embebida
  body("perfil").optional().isObject(),
  body("perfil.nombreReal").optional().trim().notEmpty().isLength({ max: 100 }),
  body("perfil.fechaNacimiento").optional().isISO8601().toDate(),
  body("perfil.posicion").optional().isString().isLength({ max: 50 }),
  body("perfil.nacionalidad").optional().isString().isLength({ max: 50 }),
  validarCampos,
];
