// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
// import type { Theme } from 'vitepress'
import './style.css'
import Theme from '@escook/vitepress-theme'
import '@escook/vitepress-theme/style.css'

export default {
    extends: Theme,
    Layout: () => {
        return h(Theme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        })
    },
    enhanceApp({ app, router, siteData }) {
        // ...
    }
} 

