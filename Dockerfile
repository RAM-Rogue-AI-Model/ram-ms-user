
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10.13.1 tsx

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile && pnpm prisma:generate

COPY . .

CMD ["tsx", "src/app.ts"]