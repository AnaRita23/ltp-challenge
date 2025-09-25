import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, Link, useLoaderData, useSearchParams, useSubmit, Form } from "@remix-run/react";
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
const stylesHref = "/assets/styles-CpVwV59K.css";
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
async function loader({ request }) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const skip = (page - 1) * PAGE_SIZE;
  const sortRaw = url.searchParams.get("sort") || "";
  const allowed = /* @__PURE__ */ new Set(["title-asc", "title-desc", "price-asc", "price-desc"]);
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
    const collator = new Intl.Collator(void 0, { sensitivity: "base", numeric: true });
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
  return json({ products, total, page, totalPages, sort });
}
function Index() {
  const { products, total, page, totalPages, sort } = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const sortQS = sort ? `&sort=${encodeURIComponent(sort)}` : "";
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const WINDOW = 5;
  let startPage = Math.max(1, page - Math.floor(WINDOW / 2));
  let endPage = startPage + WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - WINDOW + 1);
  }
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
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "page", value: "1" })
          ] }) }),
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
              to: `/?page=${page - 1}${sortQS}`,
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
                to: `/?page=${n}${sortQS}`,
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
              to: `/?page=${page + 1}${sortQS}`,
              className: "page nav",
              "aria-label": "Next page",
              children: "›"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "Sidebar" })
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
const serverManifest = { "entry": { "module": "/assets/entry.client-C0H3yrQ3.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BPUaVNZ0.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contact-8PwFSVUh.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-ClmP0etf.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-QBe-lxnv.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes/blog": { "id": "routes/blog", "parentId": "root", "path": "blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blog-BUivwrVp.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] }, "routes/shop": { "id": "routes/shop", "parentId": "root", "path": "shop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/shop-CR5hE90v.js", "imports": ["/assets/components-WLkNS9Eh.js"], "css": [] } }, "url": "/assets/manifest-2354dd74.js", "version": "2354dd74" };
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
