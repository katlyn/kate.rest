import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>kate.rest</title>
        <link rel="stylesheet" href="/styles.css" />

        <link rel="preconnect" href="https://static.katlyn.dev" />
        <link
          rel="stylesheet"
          href="https://static.katlyn.dev/fonts/minireset.css"
        />
        <link
          rel="stylesheet"
          href="https://static.katlyn.dev/fonts/lexend/lexend.css"
        />
        <link
          rel="stylesheet"
          href="https://static.katlyn.dev/fonts/berkeley/berkeley.css"
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
