import { matchedData } from "express-validator";
import { AlbumModel } from "../models/album.model.js";
import { PcModel } from "../models/pc.model.js";

export const crearAlbum = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const album = await AlbumModel.create(datos);
    res
      .status(201)
      .json({ ok: true, mensaje: "Album creado correctamente", datos: album });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el Album",
      error: error.message,
    });
  }
};

export const obtenerAlbumes = async (req, res) => {
  try {
    const albumes = await AlbumModel.find({ activo: true })
      .populate({
        path: "photocards",
        match: { activo: true },
        select: "nombre rareza",
      })
      .populate("contrato");
    res.status(200).json({ ok: true, data: albumes });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al obtener", error: error.message });
  }
};

export const obtenerAlbumPorId = async (req, res) => {
  try {
    const album = await AlbumModel.findOne({
      _id: req.params.id,
      activo: true,
    }).populate({ path: "photocard", match: { activo: true } });
    if (!album)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Album no encontrado" });
    res.status(200).json({ ok: true, data: album });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el Album",
      error: error.messange,
    });
  }
};

export const actualizarAlbum = async (req, res) => {
  try {
    const datos = matchedData(req, { locations: ["body"] });
    const album = await AlbumModel.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      datos,
      { new: true, runValidators: true },
    );
    if (!album)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Album no encontrado" });
    res.status(200).json({
      ok: true,
      mensaje: "Album actualizado correctamente",
      data: album,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el Album",
      error: error.message,
    });
  }
};

// Eliminacion logica en cascada: se quita el álbum del array de cada photocard
export const eliminarAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await AlbumModel.findOneAndUpdate(
      { _id: id, activo: true },
      { activo: false },
      { new: true },
    );
    if (!album)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Album no encontrado" });
    await PcModel.updateMany({ albumes: id }, { $pull: { albumes: id } });

    res
      .status(200)
      .json({
        ok: true,
        mensaje: "Álbum eliminado y desvinculado de sus photocards",
      });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar el Album",
      error: error.message,
    });
  }
};
