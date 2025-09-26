import { useLoaderData, Link, Form, useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader({ request }) {
    
    const { getCartSession, getCart } = await import("../utils/cart.server");
  
    const session = await getCartSession(request);
    const cart = await getCart(session);

    const items = await Promise.all(
      (cart.items ?? []).map(async ({ id, qty }) => {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) return { id, qty, title: `Product #${id}`, price: 0, thumbnail: "" };
        const p = await res.json();
        return {
          id,
          qty,
          title: p.title,
          price: Number(p.price) || 0,
          thumbnail: p.thumbnail || p.images?.[0] || "",
          lineTotal: (Number(p.price) || 0) * qty,
        };
      })
    );
  
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const shipping = totalQty > 0 ? 20 : 0;

    return json({ items, subtotal, totalQty, shipping });
}
  
export async function action({ request }) {
    const { getCartSession, getCart, setCart, commitSession } =
      await import("../utils/cart.server");
  
    const form = await request.formData();
    const intent = form.get("intent");        
    const id = Number(form.get("id"));
  
    if (!id || !["inc", "dec", "remove"].includes(intent)) {
      return new Response("Bad Request", { status: 400 });
    }
  
    const session = await getCartSession(request);
    const cart = await getCart(session);
  
    const item = cart.items.find((i) => i.id === id);
  
    if (intent === "inc") {
      if (item) item.qty += 1;
      else cart.items.push({ id, qty: 1 });
    }
  
    if (intent === "dec") {
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          cart.items = cart.items.filter((i) => i.id !== id);
        }
      }
    }
  
    if (intent === "remove") {
      cart.items = cart.items.filter((i) => i.id !== id);
    }
  
    await setCart(session, cart);
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/cart",
        "Set-Cookie": await commitSession(session),
      },
    });
}
  

export default function CartPage() {
    const { items, subtotal, totalQty, shipping } = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const count = rootData?.cartCount ?? 0;

  return (<div>
    <header className="header">
                <strong className="logo">THE ONLINE STORE</strong> 
                <nav className="pageLinks">
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/blog">Blog</Link>
                </nav>
                <div className="icons"> 

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

                <Link to="/cart" aria-label="Open cart" className="cartButton">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="cartIcon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    {count > 0 && <span className="cartBadge">{count}</span>}
                </Link>

                </div>
            </header>
    <div className="container" style={{ padding: 24 }}>
        <div className="cartMainContent" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: "0 42px 42px" }}>
            <section>
                {items.length === 0 ? (
                    <div className="emptyCart">
                    <div className="emptyThumb" />
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H3.21922L6.78345 17.2569C5.73276 17.7236 5 18.7762 5 20C5 21.6569 6.34315 23 8 23C9.65685 23 11 21.6569 11 20C11 19.6494 10.9398 19.3128 10.8293 19H15.1707C15.0602 19.3128 15 19.6494 15 20C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 20C21 18.3431 19.6569 17 18 17H8.78078L8.28078 15H18C20.0642 15 21.3019 13.6959 21.9887 12.2559C22.6599 10.8487 22.8935 9.16692 22.975 7.94368C23.0884 6.24014 21.6803 5 20.1211 5H5.78078L5.15951 2.51493C4.93692 1.62459 4.13696 1 3.21922 1H2ZM18 13H7.78078L6.28078 7H20.1211C20.6742 7 21.0063 7.40675 20.9794 7.81078C20.9034 8.9522 20.6906 10.3318 20.1836 11.3949C19.6922 12.4251 19.0201 13 18 13ZM18 20.9938C17.4511 20.9938 17.0062 20.5489 17.0062 20C17.0062 19.4511 17.4511 19.0062 18 19.0062C18.5489 19.0062 18.9938 19.4511 18.9938 20C18.9938 20.5489 18.5489 20.9938 18 20.9938ZM7.00617 20C7.00617 20.5489 7.45112 20.9938 8 20.9938C8.54888 20.9938 8.99383 20.5489 8.99383 20C8.99383 19.4511 8.54888 19.0062 8 19.0062C7.45112 19.0062 7.00617 19.4511 7.00617 20Z"
                          fill="#1F3044"
                        />
                      </svg>
                    <h2>Your cart is empty</h2>
                    <p>Browse our products and add your favorites to the cart.</p>
                    <Link to="/" className="emptyBtn">Go to Homepage</Link>
                  </div>
                ) : (
                    items.map((it) => (
                    <article key={it.id} className="cartRow">
                        <Link
                          to={`/products/${it.id}`}
                          className="cartThumbLink"
                          aria-label={`View ${it.title}`}
                        >
                          <img className="cartThumb" src={it.thumbnail} alt={it.title} />
                        </Link>

                        <div className="cartInfo">
                        <Link to={`/products/${it.id}`} className="cartTitleLink">
                          <div className="cartTitle">{it.title}</div>
                        </Link>
                          <div className="cartPrice">${it.price.toFixed(2)}</div>
                        </div>

                        <div className="cartActions">

                        <Form method="post" className="qtyControl" replace>
                            <input type="hidden" name="id" value={it.id} />
                            <button className="qtyBtn" type="submit" name="intent" value="dec" aria-label={`Decrease ${it.title}`}>−</button>
                            <span className="qtyValue">{it.qty}</span>
                            <button className="qtyBtn" type="submit" name="intent" value="inc" aria-label={`Increase ${it.title}`}>+</button>
                        </Form>

                        <Form method="post" replace>
                            <input type="hidden" name="id" value={it.id} />
                            <button className="removeBtn" type="submit" name="intent" value="remove" aria-label={`Remove ${it.title}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79a48.108 48.108 0 00-14.456 0M16 5.79V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v1.79M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2L19 6" />
                                </svg>
                            </button>
                        </Form>
                        </div>
                        <div className="lineTotal">${it.lineTotal.toFixed(2)}</div>
                       
                    </article>
                    ))
                )}
                </section>
        <div className="cartSidebar">
            <aside className="cartSummary">
                <h3>Cart Summary</h3>

                <div className="sumRow">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="sumRow">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>


                <div className="sumRow">
                    <span>Total</span>
                    <span>${(subtotal + shipping).toFixed(2)}</span>
                </div>

                <button className="checkoutBtn" type="button" disabled>Check out</button>

                <div className="payWith">Or pay with PayPal</div>

                <div className="sumDivider" />
                
                <label className="promoLabel">Promo code</label>
                <div className="promoRow">
                    <input className="promoInput" placeholder="Enter code" />
                    <button className="promoBtn" type="button" disabled>Apply</button>
                </div>
            </aside>
        </div>
        </div>
    </div>
    </div>
  );
}
