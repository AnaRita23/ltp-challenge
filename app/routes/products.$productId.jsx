import { Link, useLoaderData, Form, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

export async function loader({ params }) {
  const { productId } = params;
  if (!productId) throw new Response("Not Found", { status: 404 });

  const res = await fetch(
    `https://dummyjson.com/products/${encodeURIComponent(productId)}`
  );
  if (!res.ok) throw new Response("Product not found", { status: 404 });

  const product = await res.json();
  return json({ product });
}

export async function action({ request, params }) {
  const {
    getCartSession,
    getCart,
    setCart,
    commitSession,
  } = await import("../utils/cart.server.js");

  const form = await request.formData();
  if (form.get("intent") !== "add") return redirect(`/products/${params.productId}`);

  const qty = Math.max(1, Number(form.get("qty") || 1));
  const id = Number(params.productId);

  const session = await getCartSession(request);
  const cart = await getCart(session);

  const existing = cart.items.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else cart.items.push({ id, qty });

  await setCart(session, cart);

  return redirect(`/products/${id}?added=1`, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function ProductDetail() {
  const { product } = useLoaderData();
  const [sp] = useSearchParams();
  
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

                <Link to="/cart" aria-label="Open cart" className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </Link>

                </div>
            </header>
    <div className="productDetail container">
      <div className="mainContent">
        <div className="gallery">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      </div>
      <div className="sidebar">
        <div className="info">
            <h1 style={{ marginTop: 0 }}>{product.title}</h1>
            <p className="price" style={{ fontWeight: 600 }}>
              ${Number(product.price).toFixed(2)}
            </p>  
          </div>

          <Form method="post" replace>
            <input type="hidden" name="qty" value="1" />
            <button className="addToCart" type="submit" name="intent" value="add">
              Add to Cart
            </button>
          </Form>
          {sp.get("added") === "1" && (
            <div className="cartToast">Added to cart</div>
          )}
          <div className="divider" />
          <div className="about">
            <h3>Product Details</h3>
            <p className="desc">{product.description}</p>   
          </div>
      </div>
    </div>
    </div>
  );
}
