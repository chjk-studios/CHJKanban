FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000

ENV DB_PATH=/data/kanban.db

CMD ["bun", "run", "main"]