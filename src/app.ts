import express,{Request,Response} from "express"
const app = express()
import auth_router from './routes/auth_routes'
import user_router from "./routes/user_routes"
import path from "path"
import cookieparser from "cookie-parser"
import { config } from "dotenv"
import session from "express-session"
import { test_middleware } from "./middleware/test_middleware"
import capcha_router from "./routes/captcha_routes"


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieparser())
app.use(session({
    secret : "session-key",
    resave : false,
    saveUninitialized : true,
}))

app.use(test_middleware)

app.use("/",auth_router)
app.use("/",capcha_router)
app.use("/user",user_router)

app.listen(3000,()=>console.log("server is started on localhost:3000......"))