import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

const PAGE_SIZE = 9;

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const skip = (page - 1) * PAGE_SIZE;

    const res = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
    );
    if (!res.ok) throw new Response("Erro ao carregar produtos", { status: 500 });

    const data = await res.json();
    const products = data.products ?? [];
    const total = data.total ?? products.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return json({ products, total, page, totalPages });
}


export default function Index() {
    const { products, total, page, totalPages } = useLoaderData();
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

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

                </div>
            </header>
            <div className="container">
                <div className="mainContent">
                    <div className="filters">
                        <div className="filterCategories">

                        </div>
                        <div className="showing">
                            <small>Showing {products.length} of {total}</small>
                        </div>
                    </div>
                    <div className="productGrid">
                    {products.map((p) => (
                        <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        className="productCard"
                        style={{ textDecoration: "none", color: "inherit" }}
                        >
                        <div className="thumb">
                            <img
                            src={p.thumbnail}
                            alt={p.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                            />
                        </div>
                        <div className="title">{p.title}</div>
                        <div className="price">${Number(p.price).toFixed(2)}</div>
                        </Link>
                    ))}
                    </div>
                    <div className="pagination">
                        
                    </div>
                </div>
                <div className="Sidebar">
                    
                </div>
            </div>
        </div>
            );
  }
  