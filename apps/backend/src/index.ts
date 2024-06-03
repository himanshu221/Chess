import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { AuthRouter } from './routes/AuthRouter'
import { initPassport } from './passport'
import 'dotenv/config'

const app = express()

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

app.use('/auth', AuthRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
})