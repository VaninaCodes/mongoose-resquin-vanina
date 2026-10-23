import { matchedData } from "express-validator";
import { PcModel } from "../models/pc.model.js";

const POPULATE = [
  { path: "idol", select: "nombreArtistico grupo" },
  { path: "albumes", select: "titulo version" },
];

export const crearPc = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const pc = await PcModel.create(datos);
    res
      .status(201)
      .json({ ok: true, mensaje: "Photocard creada correctamente", datos: pc  });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear la Photocard",
      error: error.message,
    });
  }
};

export const obtenerPcs = async (req, res) => {
  try {
    const pcs = await PcModel.find({ activo: true })
      .populate(POPULATE);
    res.status(200).json({ ok: true, data: pcs });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al obtener las Photocards", error: error.message });
  }
};

export const obtenerPcPorId = async (req, res) => {
  try {
    const pc= await PcModel.findOne({
      _id: req.params.id,
      activo: true,
    }).populate(POPULATE);
    if (!pc)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Photocard no encontrada" });
    res.status(200).json({ ok: true, data: pc });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener la Photocard",
      error: error.messange,
    });
  }
};

export const actualizarPc = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const pc = await PcModel.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      datos,
      { new: true, runValidators: true },
    ).populate(POPULATE);
    if (!pc)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Photocard no encontrada" });
    res.status(200).json({
      ok: true,
      mensaje: "Photocard actualizada correctamente",
      data: pc,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar la Photocard",
      error: error.message,
    });
  }
};

export const eliminarPc = async (req, res) => {
  try {
    const { id } = req.params;
    const pc = await PcModel.findOneAndUpdate(
      { _id: id, activo: true },
      { activo: false },
      { new: true },
    );
    if (!pc)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Photocard no encontrada" });
    res
      .status(200)
      .json({
        ok: true,
        mensaje: "Photocard eliminada correctamente",
      });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar la Photocard",
      error: error.message,
    });
  }
};

// N:M: agregar un vínculo photocard - álbum
export const agregarAlbum = async (req, res) => {
  try {
    const { id, albumId } = req.params;
    const pc = await PcModel.findByIdAndUpdate(
      id,
      { $addToSet: { albumes: albumId } },
      { new: true },
    ).populate(POPULATE);
    res.status(201).json({ ok: true, mensaje: "Álbum vinculado a la photocard", data: pc });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al vincular el álbum", error: error.message });
  }
};