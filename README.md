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

## Future Scope

Currently I have only one websocket server handling all games state and logic. There is a upperlimit (around 20k for micro EC2 server) for how many persistent connections a websocket server can handle, which leads issues on scale

Following solution can be applied for scaling: 
- **Scaling via sharding**: Deploy a fleet of websocket severs and maintain `sticky connections` i.e. the users which are connected to a game should be connected to the same web socket server. This way we dont need communication between the webdocket servers for sharing the game state.
- **Scaling via pub-sub system**: Deploy a fleet of websocket servers and allow the users to connect to any websocket server. Maintain a pub-sub where web socket servers which are hosting the game are subscribed for that particular game events. This way whenever there is a move played in the game it is published to the pub-sub and all the intereted websocket servers get the move.
   
