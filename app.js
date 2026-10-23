import "dotenv/config";
import express from "express";
import { conectarDB } from "./src/config/database.js";
// Importar las rutas
// import autorRoutes from './src/routes/autor.routes.js';

const app = express();
app.use(express.json());

// app.use('/api/autores', autorRoutes);

const PORT = process.env.PORT || 3000;

await conectarDB();
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
