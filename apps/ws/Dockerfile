FROM node:lts AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@chess/ws --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo run build --filter=@chess/ws...

FROM node:lts AS runner
WORKDIR /app

# # Don't run production as root
RUN addgroup --system --gid 1001 ws
RUN adduser --system --uid 1001 ws
USER ws
COPY --from=installer /app .

WORKDIR /app/apps/ws
RUN npx prisma generate

EXPOSE 3000
CMD [ "npm", "start" ]