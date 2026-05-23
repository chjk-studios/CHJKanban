FROM oven/bun:1 AS builder

WORKDIR /app

ENV PYTHON=/usr/bin/python3

COPY package.json bun.lockb* ./
RUN bun install

COPY . .
RUN bun run astro build

FROM oven/bun:1

WORKDIR /app

COPY --from=builder /app .

EXPOSE 4321

CMD ["bun", "run", "preview"]