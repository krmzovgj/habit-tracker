import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlware/error-handler.middleware";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import habitRouter from "./routes/habit.route";
import habitLogRouter from './routes/habit-log.route'
import reminderRouter from './routes/reminder.route'

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});


app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/habit", habitRouter);
app.use("/habit-log", habitLogRouter)
app.use("/reminder", reminderRouter)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

