import passport from "passport";
import Strategy  from 'passport-google-oauth20';
import prisma from "@chess/db/client";


export const initPassport = () => {

    const GoogleStrategy = new Strategy.Strategy({
        clientID:     process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
        callbackURL: "/auth/google/callback"
      },
      async function verfiy(accessToken, refreshToken, profile, done){
            
            const user = await prisma.user.upsert({
                create : {
                    id: profile.id, 
                    name: profile.displayName,
                    email: profile._json.email || '',
                    provider: 'GOOGLE'
                },
                update: {
                    name: profile.displayName
                },
                where: {
                    id: profile.id
                }
            })
    
            done(null, user)
      }
    )
    
    
    
    passport.use(GoogleStrategy);

    passport.serializeUser((user: any, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (user: any, done) => {
        const usr = prisma.user.findFirst({
            where: {
                id: user.id
            }
        })
        done(null, usr)
    })
    
}


