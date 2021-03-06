// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

"use strict";
System.register(
  "file:///C:/Users/fengy/Desktop/coding/Deno/first/deno2",
  [],
  function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function denode(input) {
      if (input.toLowerCase() === "node") {
        return input.split("").sort().join("");
      }
      return input;
    }
    exports_1("denode", denode);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
console.log("Welcome to Deno 🦕");
System.register(
  "file:///C:/Users/fengy/Desktop/coding/Deno/first/deno3",
  [
    "file:///C:/Users/fengy/Desktop/coding/Deno/first/deno2",
    "https://deno.land/std/examples/welcome.ts",
  ],
  function (exports_2, context_2) {
    "use strict";
    var deno2_js_1;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [
        function (deno2_js_1_1) {
          deno2_js_1 = deno2_js_1_1;
        },
        function (_1) {
        },
      ],
      execute: function () {
        console.log(deno2_js_1.denode("NODE"));
      },
    };
  },
);

__instantiate("file:///C:/Users/fengy/Desktop/coding/Deno/first/deno3");
