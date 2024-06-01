import express from 'express'
import passport from 'passport'
const router = express.Router()
const CLIENT_URL='http://localhost:5173'
router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect: '/login/failure',
    successRedirect: `${CLIENT_URL}/game`
}))

router.get('/login/failure', (req, resp) => {
    resp.status(401).json({
        success: false,
        message: "Login failed"
    })
})

export const AuthRouter = router 