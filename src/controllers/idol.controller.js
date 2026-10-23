import { matchedData } from "express-validator";
import { IdolModel } from "../models/idol.model.js";
import { PcModel } from "../models/pc.model.js";
import { ContratoModel } from "../models/contrato.model.js";

export const crearIdol = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const idol = await IdolModel.create(datos);
    // ok: true es una clave personalizada en la respuesta JSON
    res
      .status(201)
      .json({ ok: true, mensaje: "Idol creado correctamente", datos: idol });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el idol",
      error: error.message,
    });
  }
};

export const obtenerIdols = async (req, res) => {
  try {
    const idols = await IdolModel.find({ activo: true })
      .populate({
        path: "photocards",
        match: { activo: true },
        select: "nombre rareza",
      })
      .populate("contrato");
    res.status(200).json({ ok: true, data: idols });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al obtener", error: error.message });
  }
};

export const obtenerIdolPorId = async (req, res) => {
  try {
    const idol = await IdolModel.findOne({
      _id: req.params.id,
      activo: true,
    })
      .populate({ path: "photocard", match: { activo: true } })
      .populate("contrato");
    if (!idol)
      return res.status(404).json({ ok: false, mensaje: "Idol no encontrado" });
    res.status(200).json({ ok: true, data: idol });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el idol",
      error: error.messange,
    });
  }
};

export const actualizarIdol = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const idol = await IdolModel.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      datos,
      { new: true, runValidators: true },
    );
    if (!idol)
      return res.status(404).json({ ok: false, mensaje: "Idol no encontrado" });
    res.status(200).json({
      ok: true,
      mensaje: "Idol actualizado correctamente",
      data: idol,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el idol",
      error: error.message,
    });
  }
};

// Eliminacion logica en cascada: se desactiva sus photocards y sus contratos
export const eliminarIdol = async (req, res) => {
  try {
    const { id } = req.params;
    const idol = await IdolModel.findOneAndUpdate(
      { _id: id, activo: true },
      { activo: false },
      { new: true },
    );
    if (!idol)
      return res.status(404).json({ ok: false, mensaje: "Idol no encontrado" });
    const pcs = await PcModel.updateMany({ idol: id }, { activo: false });
    await ContratoModel.updateMany({ idol: id }, { activo: false });
    res
      .status(200)
      .json({
        ok: true,
        mensaje: `Idol eliminado. Photocards desactivadas: ${pcs.modifiedCount}`,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al eliminar el idol",
        error: error.message,
      });
  }
};
