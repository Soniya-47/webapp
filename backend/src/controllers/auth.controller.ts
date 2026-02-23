import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};
