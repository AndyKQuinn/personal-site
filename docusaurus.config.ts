import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
  title: "Andy Quinn",
  tagline: "Engineer ~ Developer ~ Cat Lover",
  favicon: "img/favicon.ico",
  url: "https://andykquinn.vercel.app",
  baseUrl: "/",
  organizationName: "humanehumaningllc",
  projectName: "Andy Quinn Portfolio Site",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/AndyKQuinn/personal-site/tree/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/AndyKQuinn/personal-site/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.jpg",
    navbar: {
      title: "Andy K Quinn",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/graph", label: "Skills", position: "left" },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/blob", label: "Tinkering Zone", position: "left" },
        {
          href: "https://github.com/AndyKQuinn/personal-site",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
