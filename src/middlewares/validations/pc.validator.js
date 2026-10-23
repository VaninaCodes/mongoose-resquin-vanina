import { body, param } from "express-validator";
import { AlbumModel } from "../../models/album.model.js";
import { IdolModel } from "../../models/idol.model.js";
import { PcModel } from "../../models/pc.model.js";
import { validarCampos } from "../validarCampos.js";

const RAREZAS = ["Común", "Rara", "Benefit", "Broadcast"];

export const crearPcValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("imagenUrl")
    .optional()
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),
  body("rareza")
    .optional()
    .isIn(RAREZAS)
    .withMessage(`La rareza debe ser: ${RAREZAS.join(", ")}`),
  body("idol")
    .notEmpty()
    .withMessage("El idol es obligatorio")
    .isMongoId()
    .withMessage("ID de idol inválido")
    // detiene la ejecución de validaciones
    .bail()
    .custom(async (idol, { req }) => {
      const existeIdol = await IdolModel.findOne({ _id: idol, activo: true });
      if (!existeIdol) throw new Error("El idol no existe");
      // evitar duplicados: mismo nombre
      const duplicada = await PcModel.findOne({
        nombre: req.body.nombre,
        idol,
        activo: true,
      });
      if (duplicada)
        throw new Error("Ese idol ya tiene una photocard con ese nombre");
    }),
  // body("imagenUrl").optional().isURL(),
  // body("rareza").optional().isIn(RAREZAS),
  validarCampos,
];
export const actualizarPcValidator = [
  param("id").isMongoId().withMessage("El ID no es un ObjectId válido"),
  body("nombre")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .custom(async (nombre, { req }) => {
      const actual = await PcModel.findById(req.params.id);
      if (!actual) return true; // el controlador responde 404
      const duplicada = await PcModel.findOne({
        nombre,
        idol: actual.idol,
        activo: true,
        _id: { $ne: actual._id },
      });
      if (duplicada)
        throw new Error("Ese idol ya tiene una photocard con ese nombre");
    }),
  body("imagenUrl").optional().isURL(),
  body("rareza").optional().isIn(RAREZAS),
  validarCampos,
];
// Endpoint N:M - ambos docs existen y el vinculo no esta duplicado

export const agregarAlbumValidator = [
  param("id")
    .isMongoId()
    .withMessage("ID de photocard inválido")
    .bail()
    .custom(async (id) => {
      const pc = await PcModel.findOne({ _id: id, activo: true });
      if (!pc) throw new Error("La photocard no existe");
    }),
  param("albumId")
    .isMongoId()
    .withMessage("ID del álbum inválido")
    .bail()
    .custom(async (albumId, { req }) => {
      const album = await AlbumModel.findOne({ _id: albumId, activo: true });
      if (!album) throw new Error("El álbum no existe");
      const duplicado = await PcModel.findOne({
        _id: req.params.id,
        albumes: albumId,
      });
      if (duplicado)
        throw new Error("La photocard ya está vinculada a ese álbum");
    }),
  validarCampos,
];
