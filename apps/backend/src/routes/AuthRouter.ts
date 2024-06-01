import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect: '/login/failure',
    successRedirect: '/game'
}))

router.get('/login/failure', (req, resp) => {
    resp.status(401).json({
        success: false,
        message: "Login failed"
    })
})

export const AuthRouter = router 