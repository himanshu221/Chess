# Chess

Live: [chess.himanshubhushan.com](https://chess.himanshubhushan.com)

This is a monorepo for a multiplayer chess platform like `chess.com` where players can join, login with their google account and play chess.

Following features are support:
- Players can login with Google Account.
- Player can start a new game.
- We are using postgreSQL to store all games and its moves but the game state is maintained on the websocket server for low latency in moves. Primary purpose of saving game state in DB is for recovery management on refreshes/websocket server restarts.
- Player can resign from a game.
- There is a timeout logic which gives 10mins each to players and websocket ends the game if a player timer timesout.

## Architecture and Execution flow

![Architecture](Chess-arch.png)

1. Client go to `chess.himanshubhushan.com`.
2. CDN Network fetches the static asset files for the first request from the object store.
3. CDN pop will cache the files for further request improving the response time.
4. 


## Tech Stack

Let's keep it simple

- React for Frontend
- Node.js for Backend
- Typescript as the language
- Websocket server for handling real time games

## Deployment

- React frontend is deployed on Cloudfront distribution (CDN Network) with asset files for app frontend placed in AWS S3 bucket (Object Store).
- Backend and websocket is deployed on an AWS EC2 server running on port 3000 and 3001 respectively and all request are routed to these services through an nginx reverse proxy server listening on default https port 443.

## Modules

The monorepo contains following apps :
- Websocket backend using ws library for handling game logic
- Express backend to authenicate with google OAuth2.0 using passportjs library
- React frontend 

## Setting it up locally
1. Clone the repo
2. Run `npm i`
3. Add `.env` files in backend, ws and packages/db from `.env.example` file.
4. Run `cd packages/db`.
5. Run `npx prisma migrate dev`.
6. Run `npx prisma generate`.
7. npm run dev ( turbo will build all modules )
