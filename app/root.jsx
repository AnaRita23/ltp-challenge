import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData
  } from "@remix-run/react";
import { json } from "@remix-run/node";
  
import stylesHref from "./styles.css?url";

export async function loader({ request }) {
  const { getCartSession, getCart, cartCount } = await import("./utils/cart.server");
  const session = await getCartSession(request);
  const cart = await getCart(session);
  return json({ cartCount: cartCount(cart) });
}

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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <Meta />
          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
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