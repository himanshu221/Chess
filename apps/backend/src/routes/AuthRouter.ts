import { AuthUser, UserSession } from '@chess/commons/definition';
import prisma from '@chess/db/client';
import express from 'express'
import passport from 'passport'
const router = express.Router()
const CLIENT_URL='http://localhost:5173'

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect: '/login/failure',
    successRedirect: `${CLIENT_URL}/game/random`
}))

router.get('/refresh', async (req, resp) => {

    if(req.isAuthenticated()){
        const user = req.user as UserSession
 
        try{
            const userDb = await prisma.user.findFirst({
                where: {
                    id: user.id
                }
            })
            if(userDb){
                const userResp : {success: boolean, payload: AuthUser} = {
                    success: true,
                    payload: {
                        id: userDb.id,
                        name: userDb.username
                    }
                }
                return resp.json(userResp)
            }
            return resp.status(401).json({
                success: false,
                payload: {
                    message: "User not found in database"
                }
            })
                
        }catch(e) {
            console.log(e)
        }

        return resp.status(401).json({
            success: false,
            payload: {
                message: "User not found in database"
            }
        })
    }
    return resp.status(401).json({
        success: false,
        payload: {
            message: "User not found in database"
        }
    })
})
router.get('/login/failure', (req, resp) => {
    resp.status(401).json({
        success: false,
        payload: {
            message: "User not found in database"
        }
    })
})

export const AuthRouter = router 