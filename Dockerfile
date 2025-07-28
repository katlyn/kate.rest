FROM denoland/deno:alpine-2.4.2
WORKDIR /katlyn-rest
ENV DATABASE_URL="/db.sqlite"

# Copy over finalized files
COPY . .
RUN deno cache main.ts
RUN deno run -A npm:prisma generate

EXPOSE 8000

CMD ["run", "-A", "main.ts"]
