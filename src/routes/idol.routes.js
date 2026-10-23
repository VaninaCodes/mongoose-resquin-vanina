import { Router } from "express";
import {
  crearIdol,
  obtenerIdols,
  obtenerIdolPorId,
  actualizarIdol,
  eliminarIdol,
} from "../controllers/idol.controller.js";
import {
  crearIdolValidator,
  actualizarIdolValidator,
} from "../middlewares/validations/idol.validator.js";
import { validarIdParam } from "../middlewares/validarId.js";

 const router = Router();
router.post("/", crearIdolValidator, crearIdol);
router.get("/", obtenerIdols);
router.get("/:id", validarIdParam, obtenerIdolPorId);
router.put("/:id", actualizarIdolValidator, actualizarIdol);
router.delete("/:id", validarIdParam, eliminarIdol);
export default router;