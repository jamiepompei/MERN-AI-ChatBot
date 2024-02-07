import app from "./app.js";
import { connectToDatabase } from "./database/connection.js";

// connections and listeners
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log("AI ChatBot Server Open & Connected to Database! "));
}).catch(err => console.log(err));
