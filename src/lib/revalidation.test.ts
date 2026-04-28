import test from "node:test";
import assert from "node:assert/strict";

import { getRevalidationTargets } from "./revalidation.ts";

test("product changes revalidate product, list, home, and category paths for both locales", () => {
  const targets = getRevalidationTargets({
    _type: "product",
    slug: "wax-it-wet",
    categorySlug: "protection",
  });

  assert.deepEqual(targets, [
    { path: "/az", type: "page" },
    { path: "/ru", type: "page" },
    { path: "/az/products", type: "page" },
    { path: "/ru/products", type: "page" },
    { path: "/az/categories", type: "layout" },
    { path: "/ru/categories", type: "layout" },
    { path: "/az/products/wax-it-wet", type: "page" },
    { path: "/ru/products/wax-it-wet", type: "page" },
    { path: "/az/categories/protection", type: "page" },
    { path: "/ru/categories/protection", type: "page" },
  ]);
});

test("category changes revalidate locale layouts and category paths", () => {
  const targets = getRevalidationTargets({
    _type: "category",
    slug: "protection",
  });

  assert.deepEqual(targets, [
    { path: "/az", type: "layout" },
    { path: "/ru", type: "layout" },
    { path: "/az/categories/protection", type: "page" },
    { path: "/ru/categories/protection", type: "page" },
  ]);
});

test("singleton content changes revalidate locale layouts", () => {
  const targets = getRevalidationTargets({ _type: "contactPage" });

  assert.deepEqual(targets, [
    { path: "/az", type: "layout" },
    { path: "/ru", type: "layout" },
  ]);
});

test("malformed slugs are ignored", () => {
  const targets = getRevalidationTargets({
    _type: "product",
    slug: "../secret",
    categorySlug: "protection?bad=true",
  });

  assert.deepEqual(targets, [
    { path: "/az", type: "page" },
    { path: "/ru", type: "page" },
    { path: "/az/products", type: "page" },
    { path: "/ru/products", type: "page" },
    { path: "/az/categories", type: "layout" },
    { path: "/ru/categories", type: "layout" },
  ]);
});
