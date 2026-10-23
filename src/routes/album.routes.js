import { Router } from "express";
import {
  crearAlbum,
  obtenerAlbumes,
  obtenerAlbumPorId,
  actualizarAlbum,
  eliminarAlbum,
} from "../controllers/album.controller.js";
import {
  crearAlbumValidator,
  actualizarAlbumValidator,
} from "../middlewares/validations/album.validator.js";
import { validarIdParam } from "../middlewares/validarId.js";

const router = Router();
router.post("/", crearAlbumValidator, crearAlbum);
router.get("/", obtenerAlbumes);
router.get("/:id", validarIdParam, obtenerAlbumPorId);
router.put("/:id", actualizarAlbumValidator, actualizarAlbum);
router.delete("/:id", validarIdParam, eliminarAlbum);
export default router;