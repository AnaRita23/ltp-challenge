import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
  
import stylesHref from "./styles.css?url";

export const links = () => [
{ rel: "stylesheet", href: stylesHref },
];

  export default function App() {
    return (
      <html>
        <head>
          <link
            rel="icon"
            href="data:image/x-icon;base64,AA"
          />
          <Meta />
          <Links />
          <link
             rel="stylesheet"
             href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          />
          <Meta />
          <Links />
          <link
             rel="stylesheet"
             href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap"
          />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
  
          <Scripts />
        </body>
      </html>
    );
  }
  
export const meta = () => [
{ name: "viewport", content: "width=device-width, initial-scale=1" },
];