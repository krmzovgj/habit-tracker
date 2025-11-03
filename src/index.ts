import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { errorHandler } from "./middlware/error-handler.middleware";
import "./jobs/reminder.job";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import habitRouter from "./routes/habit.route";
import habitLogRouter from "./routes/habit-log.route";
import reminderRouter from "./routes/reminder.route";

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

io.on("connection", async (socket) => {
    socket.on("joinRoom", (user) => {
        const userId = Number(user.id)
        socket.join(userId.toString());
        console.log(`User with id ${userId} joined room`);
    });
});

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/habit", habitRouter);
app.use("/habit-log", habitLogRouter);
app.use("/reminder", reminderRouter);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
