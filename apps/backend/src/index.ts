import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { AuthRouter } from './routes/AuthRouter'
import { initPassport } from './passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { FRONTEND_URL } from '@chess/commons/consts'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret: process.env.SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge: 24 * 60 * 60 * 1000
    }
}
))

initPassport()

app.use(passport.session());

const allowedOrigins : Array<string> = process.env.CORS_ALLOWED_ORIGINS?.split(",") || [FRONTEND_URL]

app.use(cors({
    origin: allowedOrigins, 
    credentials:true
}))

app.use('/auth', AuthRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
})