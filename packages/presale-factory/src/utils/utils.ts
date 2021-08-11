import humanizeDuration from "humanize-duration";

export const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "yr",
      mo: () => "mon",
      w: () => "w",
      d: () => "d",
      h: () => "hr",
      m: () => "min",
      s: () => "sec",
      ms: () => "ms",
    },
  },
});
