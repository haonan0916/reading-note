import {
  defineComponent,
  h
} from "./chunk-NKN4ALJC.js";
import "./chunk-5WRI5ZAA.js";

// node_modules/@escook/vitepress-theme/dist/index.js
import m from "vitepress/theme";
import { useData as y, defineClientComponent as n } from "vitepress";
var b = defineComponent({
  setup(g, { slots: i }) {
    var s, l, r, u;
    const o = i, { Layout: c } = m, { site: f } = y(), e = f.value.themeConfig, p = ((s = e.musicBall) == null ? void 0 : s.enable) && (((l = e.musicBall) == null ? void 0 : l.src) || ((u = (r = e.musicBall) == null ? void 0 : r.list) == null ? void 0 : u.length) > 0), h2 = n(() => import("./EscookMusicBall-BkDBnoZh-YQYO733V.js"), [
      {
        style: { display: e.musicBall && e.musicBall.visible ? "" : "none" }
      }
    ]), C = n(() => import("./EscookHomeFeatureBefore-D_e5sYrO-L2JYIJ7K.js")), B = n(() => import("./EscookConfetti-BU05OPRV-YB6VIPAB.js"));
    return () => [
      h(c, null, { ...i, "home-features-before": () => {
        var a;
        return [h(C), (a = o["home-features-before"]) == null ? void 0 : a.call(o)];
      } }),
      p && h(h2),
      e.confetti && h(B)
    ];
  }
});
var D = {
  extends: { ...m },
  Layout: b,
  enhanceApp({}) {
  }
};
export {
  D as default
};
//# sourceMappingURL=@escook_vitepress-theme.js.map
