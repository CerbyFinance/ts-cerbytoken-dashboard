module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ethbtnleft: "var(--ethbtnleft)",
        ethbtnlefthov: "var(--ethbtnlefthov)",
        ethbtnright: "var(--ethbtnright)",
        ethbtnrighthov: "var(--ethbtnrighthov)",
        bscbtnleft: "var(--bscbtnleft)",
        bscbtnlefthov: "var(--bscbtnlefthov)",
        bscbtnright: "var(--bscbtnright)",
        bscbtnrighthov: "var(--bscbtnrighthov)",
        polybtnleft: "var(--polybtnleft)",
        polybtnlefthov: "var(--polybtnlefthov)",
        polybtnright: "var(--polybtnright)",
        polybtnrighthov: "var(--polybtnrighthov)",
        subtextprimary: "var(--subtextprimary)",
        subtextsecondary: "var(--subtextsecondary)",
        activetext: "var(--activetext)",
        activetextbg: "var(--activetextbg)",
        background: "var(--background)",
        icons: "var(--icons)",
        iconsdark: "var(--iconsdark)",
        darksecondary: "var(--darksecondary)",
        disabledbtnsec: "var(--disabledbtnsec)",
        "staking-item": "var(--staking-item)",
        "staking-divider": "var(--staking-divider)",
      },

      width: {
        150: "150px",
        136: "136px",
      },
    },
  },
  variants: {
    backgroundColor: ["dark", "hover"],

    margin: ["responsive", "last"],
  },
  plugins: [],
};
