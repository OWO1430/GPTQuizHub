const express = require('express');
const routes = require('./server/routes');
const app = express();
var cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
// const socketIo = require('socket.io');
var cors = require('cors'); // 引入 cors 模块


app.use(cors()); // 使用 cors 中间件
app.use('/api/1.0', routes);
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const roomConnections = {}; // 用于存储房间和连接的关系

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createroom', (user_id) => {
        socket.join(`room:${socket.id}`);
        console.log(`User ${user_id} created and joined room ${socket.id}`);
        roomConnections[socket.id] = {
            creater_id: user_id
        }
        socket.emit('createroom', socket.id);
        console.log(roomConnections)
    });

    socket.on('joinroom', (roomName, user_id) => {
        console.log(`User ${user_id} joined room ${roomName}`);
        if (roomConnections[roomName]) {
            socket.join(roomName);
            roomConnections[roomName].opponent_id = user_id; // 添加连接到房间的关系
        } else {
            socket.emit('joinroom_error', 'Room not found');
        }
        console.log(roomConnections)
    });

    socket.on('isready', async (roomName, user_id) => {
        console.log(`User ${user_id} is ready in room ${roomName}`);
        if (roomConnections[roomName].creater_id === user_id) {
            roomConnections[roomName].creater_status = 'ok'
        }
        if (roomConnections[roomName].opponent_id === user_id) {
            roomConnections[roomName].opponent_status = 'ok'
        }
        if (roomConnections[roomName].creater_status === 'ok' && roomConnections[roomName].opponent_status === 'ok') {
            console.log('in double status')
            console.log(roomName)
            console.log(user_id)
            // const creater_id = new ObjectId(roomConnections[roomName].creater_id);
            // const opponent_id = new ObjectId(roomConnections[roomName].opponent_id);

            const client = new MongoClient(url, { useUnifiedTopology: true });
            await client.connect();
            const db = client.db(dbName);
            const quizzesCollection = db.collection('quizzes');
            const allQuiz = await quizzesCollection.aggregate([
                { $match: {
                    $or: [
                        { user_id: creater_id },
                        { user_id: opponent_id }
                    ]
                }},
                { $sample: { size: 1 } } // 随机选择一个文档
            ]).toArray();

            const randomQuiz = allQuiz[0];
            console.log(randomQuiz)
            const questionsCollection = db.collection('questions');
            const randomQuestion = await questionsCollection.findOne({quiz_id: randomQuiz._id});

            const data = {
                article: randomQuiz.content,
                quiz:{
                    id: randomQuiz._id,
                    title: randomQuiz.title,
                    tag: randomQuiz.tag,
                    created_at: randomQuiz.created_at,
                    questions: questions
                }
            }

        io.to(roomName).emit('isready', {data});
        }
    });
    
    socket.on('updatescore', (roomName, user_id, users_score) => {
        socket.join(socket.id);
        if (!roomConnections[roomName].score)
            roomConnections[roomName].score = [];
        
        roomConnections[roomName].score.push({user_id, score:users_score})
        
        
        if (roomConnections[roomName].score.length == 2){
            roomConnections[roomName].score.sort((a, b) => b.score - a.score);
            io.to(roomName).emit('updatescore', roomConnections[roomName].score)
        }
    })

    socket.on('end', (roomName, user_id, users_score) => {
        socket.join(socket.id);
        if (!roomConnections[roomName].score)
            roomConnections[roomName].score = [];
        
        roomConnections[roomName].score.push({user_id, score:users_score})
        
        
        if (roomConnections[roomName].score.length == 2){
            roomConnections[roomName].score.sort((a, b) => b.score - a.score);
            io.to(roomName).emit('end', roomConnections[roomName].score)
        }
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        delete roomConnections[socket.id];
    });
})
/*
app.listen(3000, () => {
    console.log(`Ready. Listening in ${3000}`);
}); 
*/

server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
