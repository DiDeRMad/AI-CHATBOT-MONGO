const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect("mongodb://localhost:27017/chatbot", { useNewUrlParser: true, useUnifiedTopology: true });

const MessageSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const Message = mongoose.model("Message", MessageSchema);

// Эндпоинт для отправки сообщений
app.post("/chat", async (req, res) => {
    const { question } = req.body;
    
    // Поиск ответа в базе данных
    const found = await Message.findOne({ question });
    
    if (found) {
        return res.json({ answer: found.answer });
    }

    // Если нет ответа, бот учится
    const newMessage = new Message({ question, answer: "Ответ неизвестен. Добавьте в базу." });
    await newMessage.save();

    res.json({ answer: "Ответ неизвестен. Добавьте в базу." });
});

app.listen(3000, () => console.log("Сервер запущен на порту 3000"));