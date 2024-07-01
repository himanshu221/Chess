# Chess

Live: [chess.himanshubhushan.com](https://chess.himanshubhushan.com)

This is a multiplayer chess platform like `chess.com` where players can join, login with their google account and play chess.

Following features are support:
- Players can login with Google Account.
- Player can start a new game.
- We are using postgreSQL to store all games and its moves but the game state is maintained on the websocket server for low latency in moves. Primary purpose of saving game state in DB is for recovery management on refreshes/websocket server restarts.
- Player can resign from a game.
- There is a timeout logic which gives 10mins each to players and websocket ends the game if a player timer timesout.

## Architecture and Execution flow

![Architecture](Chess-arch.png)

1. Client go to `chess.himanshubhushan.com`.


## Tech Stack

Let's keep it simple

React for Frontend
Node.js for Backend
Typescript as the language
Websocket server for handling real time games

## Modules

The monorepo contains following apps :
- Websocket backend using ws library for handling game logic
- Express backend to authenicate with google auth2 using passport library
- React frontend 

## Setting it up locally
1. Clone the repo
2. npm i
3. npm run dev ( turbo will build all modules )

## [Demo link](https://x.com/himcarnation/status/1784149274462491111?s=46&t=Q_fESzJvSFTSKxBLp87n4Q)
