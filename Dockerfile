FROM denoland/deno:alpine-2.4.2
WORKDIR /katlyn-dev
EXPOSE 80

# Copy over finalized files
COPY . .
RUN deno cache main.ts

EXPOSE 8000

CMD ["run", "-A", "main.ts"]
