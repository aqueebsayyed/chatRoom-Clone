const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectToDb = require("./config/db")
const user = require("./router/user.router")
const chat = require("./router/chat.router")
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const http = require("http");
const {socketServer} = require("./service/socketServer");
// dotenv config
dotenv.config()
// const initilizeSocket = require("./service/socketService");
// const socketService = require("./service/socketService");

//middleware
app.use(express.json())
app.use(cookieparser())
app.use(bodyParser.urlencoded({extended:true}))

//database connect
connectToDb()

// cors

const corsOptions = {
    origin:process.env.FRONTEND_URL,
    credentials:true
}


app.use(cors(corsOptions))


// socket 
const server = http.createServer(app);
// const io = socketService(server)
// Initialize socket.io server

(async () => {
  await socketServer(server);
})();


// app.use((req,res,next)=>{
//     req.io = io
//     next()
// })



app.get("/", (req, res) => {
  res.send("Hello World");  
});

// routers
app.use("/api/auth", user)
app.use("/api/chat", chat)

server.listen(8000, () => {
  console.log("Server connected on port 8000"); 
});
