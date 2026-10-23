import e, { Router } from "express";
import {
  crearContrato,
  obtenerContratos,
  obtenerContratoPorId,
  actualizarContrato,
  eliminarContrato,
} from "../controllers/contrato.controller.js";
import {
  crearContratoValidator,
  actualizarContratoValidator,
} from "../middlewares/validations/contrato.validator.js";
import { validarIdParam } from "../middlewares/validarId.js";

const router = Router();
router.post("/", crearContratoValidator, crearContrato);
router.get("/", obtenerContratos);
router.get("/:id", validarIdParam, obtenerContratoPorId);
router.put("/:id", actualizarContratoValidator, actualizarContrato);
router.delete("/:id", validarIdParam, eliminarContrato);
export default router;