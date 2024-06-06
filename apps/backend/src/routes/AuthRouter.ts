import { AuthUser, UserSession } from '@chess/commons/definition';
import prisma from '@chess/db/client';
import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { FRONTEND_URL } from '@chess/commons/consts';
import cookieParser from 'cookie-parser';

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET || 'secret'

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect: '/login/failure',
    successRedirect: `${FRONTEND_URL}/game/random`
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
                const token = jwt.sign({
                    id: userDb.id,
                    name: userDb.username
                }, jwtSecret)
                
                resp.cookie('token', token)
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