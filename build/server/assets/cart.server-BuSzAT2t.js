import { createCookieSessionStorage } from "@remix-run/node";
const cartSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cart",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET || "dev-secret"],
    maxAge: 60 * 60 * 24 * 7
    // 7 dias
  }
});
async function getCartSession(request) {
  return cartSessionStorage.getSession(request.headers.get("Cookie"));
}
async function getCart(session) {
  return session.get("cart") ?? { items: [] };
}
async function setCart(session, cart) {
  session.set("cart", cart);
}
function cartCount(cart) {
  return cart.items.reduce((s, i) => s + i.qty, 0);
}
const { commitSession, destroySession } = cartSessionStorage;
export {
  cartCount,
  cartSessionStorage,
  commitSession,
  destroySession,
  getCart,
  getCartSession,
  setCart
};
