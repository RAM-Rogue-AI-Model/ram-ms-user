
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10.13.1 tsx

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY src ./src
COPY prisma.config.ts tsconfig.json ./

RUN pnpm install --frozen-lockfile && npx prisma generate

COPY . .

RUN chown -R node:node /app && chmod +x entrypoint.sh
USER node
EXPOSE 3008

CMD ["./entrypoint.sh"]
