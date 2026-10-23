import { matchedData } from "express-validator";
import { ContratoModel } from "../models/contrato.model.js";
import { PcModel } from "../models/pc.model.js";

export const crearContrato = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const contrato = await ContratoModel.create(datos);
    res.status(201).json({
      ok: true,
      mensaje: "Contrato creado correctamente",
      datos: contrato,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el Contrato",
      error: error.message,
    });
  }
};

export const obtenerContratos = async (req, res) => {
  try {
    const contratos = await ContratoModel.find({ activo: true })
      .populate("idol", "nombreArtistico grupo")
      .populate("contrato");
    res.status(200).json({ ok: true, data: contratos });
  } catch (error) {
    res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al obtener los Contratos",
        error: error.message,
      });
  }
};

export const obtenerContratoPorId = async (req, res) => {
  try {
    const contrato = await ContratoModel.findOne({
      _id: req.params.id,
      activo: true,
    }).populate("idol", "nombreArtistico grupo");
    if (!contrato)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Contrato no encontrado" });
    res.status(200).json({ ok: true, data: contrato });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el Contrato",
      error: error.message,
    });
  }
};

export const actualizarContrato = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const contrato = await ContratoModel.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      datos,
      { new: true, runValidators: true },
    );
    if (!contrato)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Contrato no encontrado" });
    res.status(200).json({
      ok: true,
      mensaje: "Contrato actualizado correctamente",
      data: contrato,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el Contrato",
      error: error.message,
    });
  }
};

export const eliminarContrato = async (req, res) => {
  try {
    const contrato = await ContratoModel.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { activo: false },
      { new: true },
    );
    if (!contrato)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Contrato no encontrado" });

    res
      .status(200)
      .json({ ok: true, mensaje: "Contrato eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al eliminar el Contrato",
        error: error.message,
      });
  }
};
