import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/google', passport.authenticate('google'));


export const AuthRouter = router 