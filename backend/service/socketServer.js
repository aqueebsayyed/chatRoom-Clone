const { Server } = require("socket.io")
const Redis = require('ioredis');
const userModel = require("../models/user.model")
const dotenv = require("dotenv").config()
const { createAdapter } = require('@socket.io/redis-adapter');
const {socketAuthMiddleware}  = require("../middlewear/socketMiddleWear");


module.exports.socketServer = async (server) => {
    const pubClient = new Redis(process.env.REDIS_URL)
    const subClient = pubClient.duplicate()

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        },
    })

    io.adapter(createAdapter(pubClient, subClient));
    const redis = pubClient; // reuse

    async function addSocketForUser(userId, socketId) {
        await redis.sadd(`online:${userId}`, socketId);
        await redis.expire(`online:${userId}`, 60 * 60 * 24); // optional TTL
    }
    async function removeSocketForUser(userId, socketId) {
        await redis.srem(`online:${userId}`, socketId);
    }
    async function getSocketCount(userId) {
        const n = await redis.scard(`online:${userId}`);
        return n;
    }

     io.use(socketAuthMiddleware)

    io.on("connection", async (socket) => {
        const userId = socket.user.id
        console.log(`socket connected: ${socket.id} user: ${userId}`);

        // add socket to Redis set
        await addSocketForUser(userId, socket.id);

        // if first socket for user -> broadcast 'user-online'
        const count = await getSocketCount(userId);
        if (count === 1) {
            // mark user online in DB
            await userModel.findByIdAndUpdate(userId, { isOnline: true }, { new: true }).catch(console.error);
            // Notify interested parties (friends, rooms, etc.)
            io.emit('user-presence', { userId, isOnline: true }); // choose targeted emit in real app
        }
        socket.data.userId = userId;

        socket.on('disconnect', async (reason) => {
            console.log(`socket disconnected ${socket.id} reason ${reason}`);
            const uid = socket.data.userId;
            if (!uid) return;
            await removeSocketForUser(uid, socket.id);
            const remaining = await getSocketCount(uid);
            if (remaining === 0) {
                // mark offline in DB & set lastSeen
                await userModel.findByIdAndUpdate(uid, { isOnline: false, lastSeen: new Date() }).catch(console.error);
                // notify
                io.emit('user-presence', { userId: uid, isOnline: false, lastSeen: new Date() });
            }
        })

    })

    return io
}

