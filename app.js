import "dotenv/config";
import express from "express";
import { conectarDB } from "./src/config/database.js";
import idolRoutes from "./src/routes/idol.routes.js";
import albumRoutes from "./src/routes/album.routes.js";
import pcRoutes from "./src/routes/pc.routes.js";
import contratoRoutes from "./src/routes/contrato.routes.js";

const app = express();
app.use(express.json());

app.use("/api/idols", idolRoutes);
app.use("/api/albumes", albumRoutes);
app.use("/api/pcs", pcRoutes);
app.use("/api/contratos", contratoRoutes);

const PORT = process.env.PORT || 3000;

await conectarDB();
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
