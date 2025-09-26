import { Link, useLoaderData, useSearchParams, Form, useSubmit, useLocation, useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

const PAGE_SIZE = 9;

async function fetchJSON(url, { timeoutMs = 15000 } = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      // Falhou (timeout/rede/5xx) - devolve null para fallback
      return null;
    } finally {
      clearTimeout(id);
    }
  }

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const skip = (page - 1) * PAGE_SIZE;
  

    const sortRaw = url.searchParams.get("sort") || "";
    const allowed = new Set(["title-asc", "title-desc", "price-asc", "price-desc"]);
    const sort = allowed.has(sortRaw) ? sortRaw : "";
  

    const selectedCategories = url.searchParams.getAll("category"); 
    const hasNone = selectedCategories.length === 0;
    const hasOne = selectedCategories.length === 1;
    const hasMulti = selectedCategories.length > 1;
  

    const category = hasOne ? selectedCategories[0] : "";
  
    async function getProductsDataBase(baseUrl) {
      const base = new URL(baseUrl);
      if (sort.startsWith("title")) {
        base.searchParams.set("limit", "0"); 
      } else {
        base.searchParams.set("limit", String(PAGE_SIZE));
        base.searchParams.set("skip", String(skip));
        if (sort) {
          const [sortBy, order] = sort.split("-");
          base.searchParams.set("sortBy", sortBy);
          base.searchParams.set("order", order);
        }
      }
  
      async function getProductsData() {
        
        let data = await fetchJSON(base.href, { timeoutMs: 15000 });
        if (data) return { data, full: sort.startsWith("title") };
  
        
        if (sort.startsWith("title")) {
          const fb = new URL(baseUrl);
          fb.searchParams.set("limit", String(PAGE_SIZE));
          fb.searchParams.set("skip", String(skip));
          const [, order] = sort.split("-");
          fb.searchParams.set("sortBy", "title");
          fb.searchParams.set("order", order);
          data = await fetchJSON(fb.href, { timeoutMs: 12000 });
          if (data) return { data, full: false };
        }
  
        
        const fb2 = new URL(baseUrl);
        fb2.searchParams.set("limit", String(PAGE_SIZE));
        fb2.searchParams.set("skip", String(skip));
        data = await fetchJSON(fb2.href, { timeoutMs: 12000 });
        if (data) return { data, full: false };
  
        return null;
      }
  
      return getProductsData();
    }
  

    async function getCategories() {
      const c1 = await fetchJSON("https://dummyjson.com/products/category-list", { timeoutMs: 15000 });
      if (Array.isArray(c1)) return c1;
      const c2 = await fetchJSON("https://dummyjson.com/products/categories", { timeoutMs: 15000 });
      if (Array.isArray(c2)) return c2;
      return [];
    }
  
    const categories = await getCategories();
  
    
    let data, full; 
    if (hasMulti) {
      const all = await fetchJSON("https://dummyjson.com/products?limit=0", { timeoutMs: 15000 });
      if (!all) {
        return json({
          products: [],
          total: 0,
          page,
          totalPages: 1,
          sort,
          category,
          selectedCategories,
          categories,
          error: "Products temporarily unavailable. Please try again.",
        });
      }
      data = all;
      full = true; 
    } else {
      const baseUrl = hasOne
        ? `https://dummyjson.com/products/category/${encodeURIComponent(category)}`
        : `https://dummyjson.com/products`;
      const result = await getProductsDataBase(baseUrl);
      if (!result) {
        return json({
          products: [],
          total: 0,
          page,
          totalPages: 1,
          sort,
          category,
          selectedCategories,
          categories,
          error: "Products temporarily unavailable. Please try again.",
        });
      }
      data = result.data;
      full = result.full;
    }
  
    let list = data.products ?? [];
  
    if (hasMulti) {
      const set = new Set(selectedCategories);
      list = list.filter((p) => set.has(p.category));
    }
  
    if (sort.startsWith("title")) {
      const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
      list.sort((a, b) => collator.compare(a.title, b.title));
      if (sort.endsWith("desc")) list.reverse();
      full = true; 
    } else if (sort.startsWith("price") && hasMulti) {
      const asc = sort.endsWith("asc");
      list.sort((a, b) => (asc ? a.price - b.price : b.price - a.price));
      full = true; 
    }
  
   
    let products, total, totalPages;
    if (full) {
      total = list.length;
      totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const start = (page - 1) * PAGE_SIZE;
      products = list.slice(start, start + PAGE_SIZE);
    } else {
      products = list; 
      total = data.total ?? products.length;
      totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    }
  
    return json({
      products,
      total,
      page,
      totalPages,
      sort,
      category,             
      selectedCategories,  
      categories,           
    });
}
  


export default function Index() {
    const { products, total, page, totalPages, sort, category, selectedCategories = [], categories } = useLoaderData();
    const [searchParams] = useSearchParams();
    const submit = useSubmit();
    const sortQS = sort ? `&sort=${encodeURIComponent(sort)}` : "";
    const catQS = selectedCategories.length
    ? selectedCategories.map(c => `&category=${encodeURIComponent(c)}`).join("")
    : "";
    const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end   = Math.min(page * PAGE_SIZE, total);

    const WINDOW = 5;
    let startPage = Math.max(1, page - Math.floor(WINDOW / 2));
    let endPage = startPage + WINDOW - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - WINDOW + 1);
    }

    const location = useLocation();

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
            <div className="container">
                <div className="mainContent">
                    <div className="filters">
                        <div className="filterCategories">
                            <Form key={`sort-${location.search}`} method="get" className="sortForm" onChange={(e) => submit(e.currentTarget, { replace: true })}>
                                <select id="sort" name="sort" defaultValue={sort || ""}>
                                    <option value="">Sort by </option>  
                                    <option value="title-asc">Title (A–Z)</option>
                                    <option value="title-desc">Title (Z–A)</option>
                                    <option value="price-asc">Price (Low → High)</option>
                                    <option value="price-desc">Price (High → Low)</option>
                                </select>

                                {selectedCategories.map(c => (
                                    <input key={c} type="hidden" name="category" value={c} />
                                ))}
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
                        to={`/?page=${page - 1}${sortQS}${catQS}`}
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
                        to={`/?page=${n}${sortQS}${catQS}`}
                        className={n === page ? "page active" : "page"}
                        aria-current={n === page ? "page" : undefined}
                        >
                        {n}
                        </Link>
                    );
                    })}


                   
                    {page < totalPages && (
                    <Link
                        to={`/?page=${page + 1}${sortQS}${catQS}`}
                        className="page nav"
                        aria-label="Next page"
                    >
                        &rsaquo;
                    </Link>
                    )}

                        </div>
                </div>
                <div className="Sidebar">
                    <div className="categoriesContainer">
                        <h3>Categories</h3>
                        <Form
                            key={`cats-${location.search}`} 
                            method="get"
                            onChange={(e) => submit(e.currentTarget, { replace: true })}
                            className="categoryForm"
                            >
                            
                            <input type="hidden" name="sort" value={sort || ""} />
                            <input type="hidden" name="page" value="1" />

                            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0" }}>
                            {categories.map((c) => (
                                <li key={c} style={{ margin: "6px 0" }}>
                                    <label>
                                    <input
                                        type="checkbox"
                                        name="category"
                                        value={c}
                                        defaultChecked={selectedCategories.includes(c)}
                                    />{" "}
                                    {c}
                                    </label>
                                </li>
                                ))}
                            </ul>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
            );
  }
  