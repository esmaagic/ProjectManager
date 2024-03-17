const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const {isAuth} = require('./middleware/authentication')
const http = require('http')
const app = express()
const server = http.createServer(app)
const chatSocket = require('./controllers/sockets');



//routers
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const projectRouter = require('./routes/projectRouter')
const taskRouter = require('./routes/taskRouter')
const timeSpentRouter = require('./routes/timeSpentRouter')
const supervisorRouter = require('./routes/supervisorRouter')
const chatRouter = require('./routes/chatRouter')


//database connection
const mongoURI = "your local database"

mongoose.connect(mongoURI)

//setting up sessions
const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'userSession',
})

app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false,
        store: store
    }))


//middleware
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(express.urlencoded({extended:false}))
app.use(express.json())


// chat






//routes
app.get('/', (req,res)=> res.render('home'))
app.get('/registerPage', (req,res)=> res.render('register'))
app.get('/loginPage', (req,res)=> res.render('login'))
app.use('/auth', authRouter)


app.use(isAuth)

app.use('/user', userRouter)
app.use('/project', projectRouter )
app.use('/task', taskRouter)
app.use('/logTime', timeSpentRouter)
app.use('/supervisors', supervisorRouter)
app.use('/inbox', chatRouter)


chatSocket(server)


server.listen(3000, ()=> console.log('servers is listening'))
