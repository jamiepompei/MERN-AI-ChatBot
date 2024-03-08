import express from 'express';
import { config } from 'dotenv';
import morgan from "morgan";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// remove in prod
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
// app.use((err, req, res, next) => {
//     console.error("app.ts " + err); // Log the error for debugging purposes
//     // Set the status code based on the type of error
//     res.status(err.cause || err.status || 500);
//     // Send a JSON response with the error message
//     res.json({
//         error: {
//             message: err.message || "Internal Server Error"
//         }
//     });
// });
export default app;
//# sourceMappingURL=app.js.map