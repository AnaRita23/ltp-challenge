import { createCookieSessionStorage } from "@remix-run/node";

export const cartSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cart",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET || "dev-secret"],
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
});

export async function getCartSession(request) {
  return cartSessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getCart(session) {
  return session.get("cart") ?? { items: [] };
}

export async function setCart(session, cart) {
  session.set("cart", cart);
}

export function cartCount(cart) {
  return cart.items.reduce((s, i) => s + i.qty, 0);
}

export const { commitSession, destroySession } = cartSessionStorage;