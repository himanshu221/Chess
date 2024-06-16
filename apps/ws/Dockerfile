FROM node:alpine3.16 AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@chess/ws --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine3.16 AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
COPY ./packages/db/prisma ./prisma/
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx prisma generate
RUN npx turbo run build --filter=@chess/ws...

FROM node:alpine3.16 AS runner
WORKDIR /app

# # Don't run production as root
RUN addgroup --system --gid 1001 ws
RUN adduser --system --uid 1001 ws
USER ws
COPY --from=installer /app .

WORKDIR /app/apps/ws
# RUN npx prisma generate

EXPOSE 8080
CMD [ "npm", "run", "start" ]