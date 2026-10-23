import { Router } from "express";
import {
  crearPc,
  obtenerPcs,
  obtenerPcPorId,
  actualizarPc,
  eliminarPc,
  agregarAlbum,
} from "../controllers/pc.controller.js";
import {
  crearPcValidator,
  actualizarPcValidator,
  agregarAlbumValidator 
} from "../middlewares/validations/pc.validator.js";
import { validarIdParam } from "../middlewares/validarId.js";

 const router = Router();
router.post("/", crearPcValidator, crearPc);
router.get("/", obtenerPcs);
router.get("/:id", validarIdParam, obtenerPcPorId);
router.put("/:id", actualizarPcValidator, actualizarPc);
router.delete("/:id", validarIdParam, eliminarPc);

// N:M
router.post("/:id/albumes/:albumId", agregarAlbumValidator, agregarAlbum);
export default router;