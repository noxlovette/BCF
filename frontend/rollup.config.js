const smelte=require("smelte/rollup-plugin-smelte");

plugins=[
    smelte({
        purge: production,
        output: "public/global.css", // it defaults to static/global.css which is probably what you expect in Sapper
        postcss: [], // Your PostCSS plugins
        whitelist: [], // Array of classnames whitelisted from purging
        whitelistPatterns: [], // Same as above, but list of regexes
        tailwind: {

            mode: "jit",
            colors: {
                primary: "#b027b0",
                secondary: "#009688",
                error: "#f44336",
                success: "#4caf50",
                alert: "#ff9800",
                blue: "#2196f3",
                dark: "#212121"
            }, // Object of colors to generate a palette from, and then all the utility classes
            darkMode: true,
        },
        // Any other props will be applied on top of default Smelte tailwind.config.js
    }),
]