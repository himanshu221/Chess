FROM node:lts AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=frontend --docker

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
RUN npx turbo run build --filter=frontend...

FROM node:lts AS runner
WORKDIR /app

# # Don't run production as root
RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontend
USER frontend
COPY --from=installer /app .

WORKDIR /app/apps/frontend

EXPOSE 5173
CMD [ "npm", "preview" ]