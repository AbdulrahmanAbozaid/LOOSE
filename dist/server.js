import app from "./config/app.js";
import { config } from 'dotenv';
import connection from "./config/db.connection.js";
import colors from "colors";
config();
const port = process.env.PORT || 3000;
process.on('uncaughtException', (error) => {
    console.log("We handle it there", error);
});
await connection();
app.listen(port, () => {
    console.log(colors.bgCyan.bold(`[server]: Server is running on port ${port}`));
});
