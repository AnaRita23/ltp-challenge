import { Link, useLoaderData, useSearchParams, Form, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";

const PAGE_SIZE = 9;

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const skip = (page - 1) * PAGE_SIZE;

    const sortRaw = url.searchParams.get("sort") || "";
    const allowed = new Set(["title-asc", "title-desc", "price-asc", "price-desc"]);
    const sort = allowed.has(sortRaw) ? sortRaw : "";

    const apiUrl = new URL("https://dummyjson.com/products");
    
    if (sort.startsWith("title")) {
        apiUrl.searchParams.set("limit", "0"); 
      } else {
        apiUrl.searchParams.set("limit", String(PAGE_SIZE));
        apiUrl.searchParams.set("skip", String(skip));
        if (sort) {
          const [sortBy, order] = sort.split("-");
          apiUrl.searchParams.set("sortBy", sortBy);
          apiUrl.searchParams.set("order", order);
        }
    }

    const res = await fetch(apiUrl.href);
    if (!res.ok) throw new Response("Erro ao carregar produtos", { status: 500 });

    const data = await res.json();
    let products, total, totalPages;

    if (sort.startsWith("title")) {
        
        const all = data.products ?? [];
        const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
        all.sort((a, b) => collator.compare(a.title, b.title));
        if (sort.endsWith("desc")) all.reverse();
    
        total = data.total ?? all.length;
        totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        products = all.slice(skip, skip + PAGE_SIZE); 
      } else {
        products = data.products ?? [];
        total = data.total ?? products.length;
        totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      }

    return json({ products, total, page, totalPages, sort});
}


export default function Index() {
    const { products, total, page, totalPages, sort } = useLoaderData();
    const [searchParams] = useSearchParams();
    const submit = useSubmit();
    const sortQS = sort ? `&sort=${encodeURIComponent(sort)}` : "";
    const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end   = Math.min(page * PAGE_SIZE, total);

    const WINDOW = 5;
    let startPage = Math.max(1, page - Math.floor(WINDOW / 2));
    let endPage = startPage + WINDOW - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - WINDOW + 1);
    }


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
                            <Form method="get" className="sortForm" onChange={(e) => submit(e.currentTarget, { replace: true })}>
                                <select id="sort" name="sort" defaultValue={sort || ""}>
                                    <option value="">Sort by </option>  
                                    <option value="title-asc">Title (A–Z)</option>
                                    <option value="title-desc">Title (Z–A)</option>
                                    <option value="price-asc">Price (Low → High)</option>
                                    <option value="price-desc">Price (High → Low)</option>
                                </select>

                                <input type="hidden" name="page" value="1" />
                                
                            </Form>
                        </div>
                        <div className="showing">
                            <small>Showing {start}-{end} of {total}</small>
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

                  
                    {page > 1 && (
                    <Link
                        to={`/?page=${page - 1}${sortQS}`}
                        className="page nav"
                        aria-label="Previous page"
                    >
                        &lsaquo;
                    </Link>
                    )}

                    
                    
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const n = startPage + i;
                    return (
                        <Link
                        key={n}
                        to={`/?page=${n}${sortQS}`}
                        className={n === page ? "page active" : "page"}
                        aria-current={n === page ? "page" : undefined}
                        >
                        {n}
                        </Link>
                    );
                    })}


                   
                    {page < totalPages && (
                    <Link
                        to={`/?page=${page + 1}${sortQS}`}
                        className="page nav"
                        aria-label="Next page"
                    >
                        &rsaquo;
                    </Link>
                    )}

                        </div>
                </div>
                <div className="Sidebar">
                    
                </div>
            </div>
        </div>
            );
  }
  