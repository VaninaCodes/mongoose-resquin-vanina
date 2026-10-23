import mongoose from "mongoose";

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Se conecto a la BD");
  } catch (error) {
    console.error("Error de conexión", error.message);
  }
};
