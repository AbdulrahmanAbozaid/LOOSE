import app from "./config/app.js";
import {config} from 'dotenv';

config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`[server]: Server is running on port ${port}`);
});