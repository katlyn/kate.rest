FROM denoland/deno:2.4.2
WORKDIR /katlyn-rest

COPY . .
RUN deno cache main.ts
RUN deno run -A npm:prisma generate

EXPOSE 8000

CMD ["run", "-A", "main.ts"]
