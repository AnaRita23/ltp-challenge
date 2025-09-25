import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, Link, useLoaderData, useSearchParams, useSubmit, useLocation, Form } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
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
const stylesHref = "/assets/styles-3EKpcTls.css";
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
      /* @__PURE__ */ jsx(Links, {})
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
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Shop$3() {
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Contact Page" }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop$3
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
async function loader({ request }) {
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
          }
        )
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
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function Shop$2() {
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "About Page" }) })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop$2
}, Symbol.toStringTag, { value: "Module" }));
function Shop$1() {
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Blog Page" }) })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop$1
}, Symbol.toStringTag, { value: "Module" }));
function Shop() {
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            className: "icon",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Shop Page" }) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BnDlbNUM.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-5AOT9awx.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contact-l9_5Xgiv.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-x8tNpAGi.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-Bt8JlAWu.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes/blog": { "id": "routes/blog", "parentId": "root", "path": "blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blog-D13of1q0.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] }, "routes/shop": { "id": "routes/shop", "parentId": "root", "path": "shop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/shop-Dpqkq6cH.js", "imports": ["/assets/components-6hZqzzL_.js"], "css": [] } }, "url": "/assets/manifest-d08150f2.js", "version": "d08150f2" };
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
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/blog": {
    id: "routes/blog",
    parentId: "root",
    path: "blog",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/shop": {
    id: "routes/shop",
    parentId: "root",
    path: "shop",
    index: void 0,
    caseSensitive: void 0,
    module: route5
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
