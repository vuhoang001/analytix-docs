// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Địa chỉ phát hành suy ra từ môi trường, không ghi cứng — site này phục vụ
// được ba đích khác nhau, mỗi đích cho địa chỉ theo một cách riêng.
//
// Thứ tự ưu tiên:
//   1. DOCS_SITE_URL   — đặt tay. Dùng khi phục vụ bằng nginx nội bộ.
//   2. CI_PAGES_URL    — GitLab CI tự điền cho GitLab Pages.
//   3. GITHUB_REPOSITORY — GitHub Actions; suy ra <chủ>.github.io/<repo>/.
//   4. localhost:3000  — chạy ở máy cá nhân.
//
// Nhờ vậy đổi nơi phục vụ không phải sửa file này.
function resolveSiteAddress() {
  const explicit = process.env.DOCS_SITE_URL || process.env.CI_PAGES_URL;
  if (explicit) return new URL(explicit);

  const ghRepo = process.env.GITHUB_REPOSITORY; // dạng "chu-so-huu/ten-repo"
  if (ghRepo) {
    const [owner, repo] = ghRepo.split('/');
    // Repo tên <owner>.github.io phục vụ ở gốc, các repo khác ở /<repo>/.
    const path = repo === `${owner}.github.io` ? '/' : `/${repo}/`;
    return new URL(`https://${owner}.github.io${path}`);
  }

  return new URL('http://localhost:3000/');
}

const diaChi = resolveSiteAddress();
const siteUrl = diaChi.origin;
const siteBaseUrl = diaChi.pathname.endsWith('/')
  ? diaChi.pathname
  : `${diaChi.pathname}/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AnalytiX',
  tagline: 'Công cụ trực quan hoá dữ liệu — cài đặt và sử dụng',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: siteUrl,
  baseUrl: siteBaseUrl,

  // Chỉ dùng cho lệnh `docusaurus deploy` của GitHub — ta không dùng lệnh đó,
  // phát hành bằng GitLab Pages (xem .gitlab-ci.yml). Giữ lại cho đủ cấu hình.
  organizationName: 'hdos',
  projectName: 'analytix',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['vi'],
        indexDocs: true,
        indexPages: false,
        docsRouteBasePath: '/',
      }),
    ],
  ],

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'AnalytiX',
        logo: {
          alt: 'AnalytiX Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tài liệu',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} CoreX.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
