import mongoose from "mongoose";
import colors from "colors";
const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || process.env.DB_LOCAL);
        console.log(colors.bgGreen.bold(`[database]: Database Connection established!`));
    }
    catch (error) {
        console.log(colors.bgRed(`[database]: Database connection error: ${error}`));
    }
};
export default connection;
