import passport from "passport";
import Strategy  from 'passport-google-oauth20';
import prisma from "@chess/db/client";

export const initPassport = () => {
    const GoogleStrategy = new Strategy.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
        callbackURL: "/auth/google/callback",
        scope: ['profile', 'email']
      },
      async function verfiy(accessToken, refreshToken, profile: any, done){
            
            const user = await prisma.user.upsert({
                create : {
                    id: profile.id, 
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'GOOGLE'
                },
                update: {
                    username: profile.displayName
                },
                where: {
                    id: profile.id
                }
            })
    
            done(null, user)
      }
    )
    
    
    
    passport.use(GoogleStrategy);

    // it is used to add user into the session in cookies
    passport.serializeUser((user: any, done) => {
        done(null, user.id)
    })
    
    // it is used to get the user information from db if the user is present in session already
    // and add the user detials to req.user
    passport.deserializeUser(async (user: any, done) => {
        const usr = prisma.user.findFirst({
            where: {
                id: user.id
            }
        })
        done(null, usr)
    })
    
}


