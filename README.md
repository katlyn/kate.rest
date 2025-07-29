# kate.rest

:3

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```sh
# Start postgres in docker
docker compose up -d

# Copy sample env file
cp .env.example .env

# Start development server
deno task start
```

This will watch the project directory and restart as necessary.
