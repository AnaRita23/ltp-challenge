import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, useLoaderData, useRouteLoaderData, useLocation, useNavigate, Link, Form, useSearchParams, useSubmit } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const stylesHref = "/assets/styles-kUBtDbya.css";
async function loader$3({ request }) {
  const { getCartSession, getCart, cartCount } = await import("./assets/cart.server-BuSzAT2t.js");
  const session = await getCartSession(request);
  const cart = await getCart(session);
  return json({ cartCount: cartCount(cart) });
}
const links = () => [
  { rel: "stylesheet", href: stylesHref }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "icon",
          href: "data:image/x-icon;base64,AA"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap",
          rel: "stylesheet"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap",
          rel: "stylesheet"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const meta = () => [
  { name: "viewport", content: "width=device-width, initial-scale=1" }
];
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  loader: loader$3,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ params }) {
  const { productId } = params;
  if (!productId) throw new Response("Not Found", { status: 404 });
  const res = await fetch(
    `https://dummyjson.com/products/${encodeURIComponent(productId)}`
  );
  if (!res.ok) throw new Response("Product not found", { status: 404 });
  const product = await res.json();
  return json({ product });
}
async function action$1({ request, params }) {
  const {
    getCartSession,
    getCart,
    setCart,
    commitSession
  } = await import("./assets/cart.server-BuSzAT2t.js");
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
    headers: { "Set-Cookie": await commitSession(session) }
  });
}
function ProductDetail() {
  var _a;
  const { product } = useLoaderData();
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("added") === "1") {
      setShowToast(true);
      const t = setTimeout(() => {
        setShowToast(false);
        params.delete("added");
        navigate({ search: params.toString() ? `?${params}` : "" }, { replace: true });
      }, 2e3);
      return () => clearTimeout(t);
    }
  }, [location.search, navigate]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "productDetail container", children: [
      /* @__PURE__ */ jsx("div", { className: "mainContent", children: /* @__PURE__ */ jsx("div", { className: "gallery", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: product.thumbnail || ((_a = product.images) == null ? void 0 : _a[0]),
          alt: product.title,
          style: { maxWidth: "100%", borderRadius: 8 }
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "sidebar", children: [
        /* @__PURE__ */ jsxs("div", { className: "info", children: [
          /* @__PURE__ */ jsx("h1", { style: { marginTop: 0 }, children: product.title }),
          /* @__PURE__ */ jsxs("p", { className: "price", style: { fontWeight: 600 }, children: [
            "$",
            Number(product.price).toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Form, { method: "post", replace: true, children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "qty", value: "1" }),
          /* @__PURE__ */ jsx("button", { className: "addToCart", type: "submit", name: "intent", value: "add", children: "Add to Cart" })
        ] }),
        showToast && /* @__PURE__ */ jsx("div", { className: "cartToast", children: "Added to cart" }),
        /* @__PURE__ */ jsx("div", { className: "divider" }),
        /* @__PURE__ */ jsxs("div", { className: "about", children: [
          /* @__PURE__ */ jsx("h3", { children: "Product Details" }),
          /* @__PURE__ */ jsx("p", { className: "desc", children: product.description })
        ] })
      ] })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: ProductDetail,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function Contact() {
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Contact Page" }) })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact
}, Symbol.toStringTag, { value: "Module" }));
const PAGE_SIZE = 9;
async function fetchJSON(url, { timeoutMs = 15e3 } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(id);
  }
}
async function loader$1({ request }) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const skip = (page - 1) * PAGE_SIZE;
  const sortRaw = url.searchParams.get("sort") || "";
  const allowed = /* @__PURE__ */ new Set(["title-asc", "title-desc", "price-asc", "price-desc"]);
  const sort = allowed.has(sortRaw) ? sortRaw : "";
  const selectedCategories = url.searchParams.getAll("category");
  selectedCategories.length === 0;
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
      let data2 = await fetchJSON(base.href, { timeoutMs: 15e3 });
      if (data2) return { data: data2, full: sort.startsWith("title") };
      if (sort.startsWith("title")) {
        const fb = new URL(baseUrl);
        fb.searchParams.set("limit", String(PAGE_SIZE));
        fb.searchParams.set("skip", String(skip));
        const [, order] = sort.split("-");
        fb.searchParams.set("sortBy", "title");
        fb.searchParams.set("order", order);
        data2 = await fetchJSON(fb.href, { timeoutMs: 12e3 });
        if (data2) return { data: data2, full: false };
      }
      const fb2 = new URL(baseUrl);
      fb2.searchParams.set("limit", String(PAGE_SIZE));
      fb2.searchParams.set("skip", String(skip));
      data2 = await fetchJSON(fb2.href, { timeoutMs: 12e3 });
      if (data2) return { data: data2, full: false };
      return null;
    }
    return getProductsData();
  }
  async function getCategories() {
    const c1 = await fetchJSON("https://dummyjson.com/products/category-list", { timeoutMs: 15e3 });
    if (Array.isArray(c1)) return c1;
    const c2 = await fetchJSON("https://dummyjson.com/products/categories", { timeoutMs: 15e3 });
    if (Array.isArray(c2)) return c2;
    return [];
  }
  const categories = await getCategories();
  let data, full;
  if (hasMulti) {
    const all = await fetchJSON("https://dummyjson.com/products?limit=0", { timeoutMs: 15e3 });
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
        error: "Products temporarily unavailable. Please try again."
      });
    }
    data = all;
    full = true;
  } else {
    const baseUrl = hasOne ? `https://dummyjson.com/products/category/${encodeURIComponent(category)}` : `https://dummyjson.com/products`;
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
        error: "Products temporarily unavailable. Please try again."
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
    const collator = new Intl.Collator(void 0, { sensitivity: "base", numeric: true });
    list.sort((a, b) => collator.compare(a.title, b.title));
    if (sort.endsWith("desc")) list.reverse();
    full = true;
  } else if (sort.startsWith("price") && hasMulti) {
    const asc = sort.endsWith("asc");
    list.sort((a, b) => asc ? a.price - b.price : b.price - a.price);
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
    categories
  });
}
function Index() {
  const { products, total, page, totalPages, sort, category, selectedCategories = [], categories } = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const sortQS = sort ? `&sort=${encodeURIComponent(sort)}` : "";
  const catQS = selectedCategories.length ? selectedCategories.map((c) => `&category=${encodeURIComponent(c)}`).join("") : "";
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const WINDOW = 5;
  let startPage = Math.max(1, page - Math.floor(WINDOW / 2));
  let endPage = startPage + WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - WINDOW + 1);
  }
  const location = useLocation();
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "mainContent", children: [
        /* @__PURE__ */ jsxs("div", { className: "filters", children: [
          /* @__PURE__ */ jsx("div", { className: "filterCategories", children: /* @__PURE__ */ jsxs(Form, { method: "get", className: "sortForm", onChange: (e) => submit(e.currentTarget, { replace: true }), children: [
            /* @__PURE__ */ jsxs("select", { id: "sort", name: "sort", defaultValue: sort || "", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Sort by " }),
              /* @__PURE__ */ jsx("option", { value: "title-asc", children: "Title (A–Z)" }),
              /* @__PURE__ */ jsx("option", { value: "title-desc", children: "Title (Z–A)" }),
              /* @__PURE__ */ jsx("option", { value: "price-asc", children: "Price (Low → High)" }),
              /* @__PURE__ */ jsx("option", { value: "price-desc", children: "Price (High → Low)" })
            ] }),
            selectedCategories.map((c) => /* @__PURE__ */ jsx("input", { type: "hidden", name: "category", value: c }, c)),
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "page", value: "1" })
          ] }, `sort-${location.search}`) }),
          /* @__PURE__ */ jsx("div", { className: "showing", children: /* @__PURE__ */ jsxs("small", { children: [
            "Showing ",
            start,
            "-",
            end,
            " of ",
            total
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "productGrid", children: products.map((p) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/products/${p.id}`,
            className: "productCard",
            style: { textDecoration: "none", color: "inherit" },
            children: [
              /* @__PURE__ */ jsx("div", { className: "thumb", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: p.thumbnail,
                  alt: p.title,
                  style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "title", children: p.title }),
              /* @__PURE__ */ jsxs("div", { className: "price", children: [
                "$",
                Number(p.price).toFixed(2)
              ] })
            ]
          },
          p.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "pagination", children: [
          page > 1 && /* @__PURE__ */ jsx(
            Link,
            {
              to: `/?page=${page - 1}${sortQS}${catQS}`,
              className: "page nav",
              "aria-label": "Previous page",
              children: "‹"
            }
          ),
          Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const n = startPage + i;
            return /* @__PURE__ */ jsx(
              Link,
              {
                to: `/?page=${n}${sortQS}${catQS}`,
                className: n === page ? "page active" : "page",
                "aria-current": n === page ? "page" : void 0,
                children: n
              },
              n
            );
          }),
          page < totalPages && /* @__PURE__ */ jsx(
            Link,
            {
              to: `/?page=${page + 1}${sortQS}${catQS}`,
              className: "page nav",
              "aria-label": "Next page",
              children: "›"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "Sidebar", children: /* @__PURE__ */ jsxs("div", { className: "categoriesContainer", children: [
        /* @__PURE__ */ jsx("h3", { children: "Categories" }),
        /* @__PURE__ */ jsxs(
          Form,
          {
            method: "get",
            onChange: (e) => submit(e.currentTarget, { replace: true }),
            className: "categoryForm",
            children: [
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "sort", value: sort || "" }),
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "page", value: "1" }),
              /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: "8px 0" }, children: categories.map((c) => /* @__PURE__ */ jsx("li", { style: { margin: "6px 0" }, children: /* @__PURE__ */ jsxs("label", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "category",
                    value: c,
                    defaultChecked: selectedCategories.includes(c)
                  }
                ),
                " ",
                c
              ] }) }, c)) })
            ]
          },
          `cats-${location.search}`
        )
      ] }) })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function About() {
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "About Page" }) })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
function Blog() {
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Blog Page" }) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Blog
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ request }) {
  const { getCartSession, getCart } = await import("./assets/cart.server-BuSzAT2t.js");
  const session = await getCartSession(request);
  const cart = await getCart(session);
  const items = await Promise.all(
    (cart.items ?? []).map(async ({ id, qty }) => {
      var _a;
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) return { id, qty, title: `Product #${id}`, price: 0, thumbnail: "" };
      const p = await res.json();
      return {
        id,
        qty,
        title: p.title,
        price: Number(p.price) || 0,
        thumbnail: p.thumbnail || ((_a = p.images) == null ? void 0 : _a[0]) || "",
        lineTotal: (Number(p.price) || 0) * qty
      };
    })
  );
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const shipping = totalQty > 0 ? 20 : 0;
  return json({ items, subtotal, totalQty, shipping });
}
async function action({ request }) {
  const { getCartSession, getCart, setCart, commitSession } = await import("./assets/cart.server-BuSzAT2t.js");
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
      "Set-Cookie": await commitSession(session)
    }
  });
}
function CartPage() {
  const { items, subtotal, totalQty, shipping } = useLoaderData();
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container", style: { padding: 24 }, children: /* @__PURE__ */ jsxs("div", { className: "cartMainContent", style: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: "0 42px 42px" }, children: [
      /* @__PURE__ */ jsx("section", { children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "emptyCart", children: [
        /* @__PURE__ */ jsx("div", { className: "emptyThumb" }),
        /* @__PURE__ */ jsx(
          "svg",
          {
            width: "40",
            height: "40",
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H3.21922L6.78345 17.2569C5.73276 17.7236 5 18.7762 5 20C5 21.6569 6.34315 23 8 23C9.65685 23 11 21.6569 11 20C11 19.6494 10.9398 19.3128 10.8293 19H15.1707C15.0602 19.3128 15 19.6494 15 20C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 20C21 18.3431 19.6569 17 18 17H8.78078L8.28078 15H18C20.0642 15 21.3019 13.6959 21.9887 12.2559C22.6599 10.8487 22.8935 9.16692 22.975 7.94368C23.0884 6.24014 21.6803 5 20.1211 5H5.78078L5.15951 2.51493C4.93692 1.62459 4.13696 1 3.21922 1H2ZM18 13H7.78078L6.28078 7H20.1211C20.6742 7 21.0063 7.40675 20.9794 7.81078C20.9034 8.9522 20.6906 10.3318 20.1836 11.3949C19.6922 12.4251 19.0201 13 18 13ZM18 20.9938C17.4511 20.9938 17.0062 20.5489 17.0062 20C17.0062 19.4511 17.4511 19.0062 18 19.0062C18.5489 19.0062 18.9938 19.4511 18.9938 20C18.9938 20.5489 18.5489 20.9938 18 20.9938ZM7.00617 20C7.00617 20.5489 7.45112 20.9938 8 20.9938C8.54888 20.9938 8.99383 20.5489 8.99383 20C8.99383 19.4511 8.54888 19.0062 8 19.0062C7.45112 19.0062 7.00617 19.4511 7.00617 20Z",
                fill: "#1F3044"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("h2", { children: "Your cart is empty" }),
        /* @__PURE__ */ jsx("p", { children: "Browse our products and add your favorites to the cart." }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "emptyBtn", children: "Go to Homepage" })
      ] }) : items.map((it) => /* @__PURE__ */ jsxs("article", { className: "cartRow", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/products/${it.id}`,
            className: "cartThumbLink",
            "aria-label": `View ${it.title}`,
            children: /* @__PURE__ */ jsx("img", { className: "cartThumb", src: it.thumbnail, alt: it.title })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "cartInfo", children: [
          /* @__PURE__ */ jsx(Link, { to: `/products/${it.id}`, className: "cartTitleLink", children: /* @__PURE__ */ jsx("div", { className: "cartTitle", children: it.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "cartPrice", children: [
            "$",
            it.price.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "cartActions", children: [
          /* @__PURE__ */ jsxs(Form, { method: "post", className: "qtyControl", replace: true, children: [
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "id", value: it.id }),
            /* @__PURE__ */ jsx("button", { className: "qtyBtn", type: "submit", name: "intent", value: "dec", "aria-label": `Decrease ${it.title}`, children: "−" }),
            /* @__PURE__ */ jsx("span", { className: "qtyValue", children: it.qty }),
            /* @__PURE__ */ jsx("button", { className: "qtyBtn", type: "submit", name: "intent", value: "inc", "aria-label": `Increase ${it.title}`, children: "+" })
          ] }),
          /* @__PURE__ */ jsxs(Form, { method: "post", replace: true, children: [
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "id", value: it.id }),
            /* @__PURE__ */ jsx("button", { className: "removeBtn", type: "submit", name: "intent", value: "remove", "aria-label": `Remove ${it.title}`, children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.5",
                d: "M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79a48.108 48.108 0 00-14.456 0M16 5.79V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v1.79M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2L19 6"
              }
            ) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lineTotal", children: [
          "$",
          it.lineTotal.toFixed(2)
        ] })
      ] }, it.id)) }),
      /* @__PURE__ */ jsx("div", { className: "cartSidebar", children: /* @__PURE__ */ jsxs("aside", { className: "cartSummary", children: [
        /* @__PURE__ */ jsx("h3", { children: "Cart Summary" }),
        /* @__PURE__ */ jsxs("div", { className: "sumRow", children: [
          /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            subtotal.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sumRow", children: [
          /* @__PURE__ */ jsx("span", { children: "Shipping" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            shipping.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sumRow", children: [
          /* @__PURE__ */ jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            (subtotal + shipping).toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "checkoutBtn", type: "button", disabled: true, children: "Check out" }),
        /* @__PURE__ */ jsx("div", { className: "payWith", children: "Or pay with PayPal" }),
        /* @__PURE__ */ jsx("div", { className: "sumDivider" }),
        /* @__PURE__ */ jsx("label", { className: "promoLabel", children: "Promo code" }),
        /* @__PURE__ */ jsxs("div", { className: "promoRow", children: [
          /* @__PURE__ */ jsx("input", { className: "promoInput", placeholder: "Enter code" }),
          /* @__PURE__ */ jsx("button", { className: "promoBtn", type: "button", disabled: true, children: "Apply" })
        ] })
      ] }) })
    ] }) })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: CartPage,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function Shop() {
  const rootData = useRouteLoaderData("root");
  const count = (rootData == null ? void 0 : rootData.cartCount) ?? 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("strong", { className: "logo", children: "THE ONLINE STORE" }),
      /* @__PURE__ */ jsxs("nav", { className: "pageLinks", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "icons", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" })
          }
        ),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Open cart", className: "cartButton", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "cartIcon",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
            }
          ),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "cartBadge", children: count })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Shop Page" }) })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Dc3dMqFk.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BQ3R0ofO.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/products.$productId": { "id": "routes/products.$productId", "parentId": "root", "path": "products/:productId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._productId-Dn2wHVVb.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contact-_PJA6gMw.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BhU12xZr.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-DLy-IjWG.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/blog": { "id": "routes/blog", "parentId": "root", "path": "blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blog-D-eXyASa.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/cart": { "id": "routes/cart", "parentId": "root", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cart-B-b6dW8p.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] }, "routes/shop": { "id": "routes/shop", "parentId": "root", "path": "shop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/shop-DX-x_lJJ.js", "imports": ["/assets/components-C24tdFfd.js"], "css": [] } }, "url": "/assets/manifest-d705d9ae.js", "version": "d705d9ae" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/products.$productId": {
    id: "routes/products.$productId",
    parentId: "root",
    path: "products/:productId",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/blog": {
    id: "routes/blog",
    parentId: "root",
    path: "blog",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/cart": {
    id: "routes/cart",
    parentId: "root",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/shop": {
    id: "routes/shop",
    parentId: "root",
    path: "shop",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
