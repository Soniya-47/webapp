import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { register, login } from './controllers/auth.controller.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

const prisma = new PrismaClient();

try {
    await prisma.$connect();
    console.log('Connected to Database');
} catch (e) {
    console.error('Prisma connection error:', e);
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'WhatsApp Clone Backend Running', env: process.env.VERCEL ? 'vercel' : 'local' });
});

// Auth Routes
app.post('/api/register', register);
app.post('/api/login', login);

// Chat Routes
app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true },
    });
    res.json(users);
});

app.get('/api/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    const conversations = await prisma.conversation.findMany({
        where: {
            users: {
                some: { id: userId }
            }
        },
        include: {
            users: {
                select: { id: true, username: true }
            },
            messages: {
                take: 1,
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    res.json(conversations);
});

// Socket Handler (Not supported on Vercel, but keeping for local dev)
if (!process.env.VERCEL) {
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.on('join', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on('sendMessage', async (data) => {
            const { content, senderId, conversationId } = data;
            const message = await prisma.message.create({
                data: {
                    content,
                    senderId,
                    conversationId,
                },
                include: {
                    sender: { select: { username: true } }
                }
            });
            io.to(conversationId).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

const PORT = process.env.PORT || 4000;

if (!process.env.VERCEL) {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export { io, prisma, app };
export default app;
