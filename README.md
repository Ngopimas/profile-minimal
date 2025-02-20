# Profile Minimal

A minimal, responsive and SEO-friendly Astro blog theme. This theme follows best practices and provides accessibility out of the box. Light and dark mode support.

## 💡 Lighthouse Score

<p align="center">
  <a href="https://pagespeed.web.dev/analysis/https-romaincoupey-com/58htn4d2yw?form_factor=desktop">
    <img width="710" alt="AstroPaper Lighthouse Score" src="AstroPaper-lighthouse-score.svg">
  <a>
</p>

## 🔥 Features

- ✅ Minimal and modern design
- ✅ Fully responsive and accessible
- ✅ SEO-friendly with meta tags and OpenGraph support
- ✅ Light & Dark mode support
- ✅ Fast performance with Astro
- ✅ Markdown & MDX support
- ✅ Search functionality
- ✅ Tags & Categories
- ✅ Archive posts
- ✅ Social media sharing
- ✅ Syntax highlighting
- ✅ RSS feed
- ✅ Sitemap & robots.txt

## 🚀 Project Structure

Inside this project, you'll see the following folders and files:

```bash
/
├── public/
│   ├── assets/
│   │   └── logo.svg
│   │   └── logo.png
│   └── favicon.svg
│   └── astropaper-og.jpg
│   └── robots.txt
│   └── toggle-theme.js
├── src/
│   ├── assets/
│   │   └── socialIcons.ts
│   ├── components/
│   ├── content/
│   │   |  blog/
│   │   |    └── some-blog-posts.md
│   │   └── config.ts
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── types.ts
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

All blog posts are stored in `src/content/blog` directory.

## 🚀 Getting Started

### Prerequisites

- Node.js (>=16.x)
- npm or yarn or pnpm

> **_Warning!_** If you're using `yarn 1`, you might need to [install `sharp`](https://sharp.pixelplumbing.com/install) as a dependency.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ngopimas/profile-minimal.git
cd profile-minimal
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Your site should now be running at `http://localhost:4321`

## 📝 Project Structure

```
/
├── public/
│   ├── assets/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── astro.config.ts
├── package.json
└── tsconfig.json
```

## 🎨 Customization

1. Edit site configuration in `src/config.ts`
2. Modify styles in `src/styles/base.css`
3. Add your content in `src/content/blog/`
4. Customize components in `src/components/`

## 🚀 Deployment

This site can be deployed to any platform that supports Astro:

- Netlify
- Vercel
- GitHub Pages
- And more...

Refer to [Astro's deployment guides](https://docs.astro.build/en/guides/deploy/) for detailed instructions.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

> **_Note!_** For `Docker` commands we must have it [installed](https://docs.docker.com/engine/install/) in your machine.

| Command                              | Action                                                                                                                           |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                        | Installs dependencies                                                                                                            |
| `npm run dev`                        | Starts local dev server at `localhost:4321`                                                                                      |
| `npm run build`                      | Build your production site to `./dist/`                                                                                          |
| `npm run preview`                    | Preview your build locally, before deploying                                                                                     |
| `npm run format:check`               | Check code format with Prettier                                                                                                  |
| `npm run format`                     | Format codes with Prettier                                                                                                       |
| `npm run sync`                       | Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `npm run lint`                       | Lint with ESLint                                                                                                                 |
| `docker compose up -d`               | Run Astro on docker, You can access with the same hostname and port informed on `dev` command.                                   |
| `docker compose run app npm install` | You can run any command above into the docker container.                                                                         |
| `docker build -t astropaper .`       | Build Docker image for Astro.                                                                                                    |
| `docker run -p 4321:80 astropaper`   | Run Astro on Docker. The website will be accessible at `http://localhost:4321`.                                                  |

> **_Warning!_** Windows PowerShell users may need to install the [concurrently package](https://www.npmjs.com/package/concurrently) if they want to [run diagnostics](https://docs.astro.build/en/reference/cli-reference/#astro-check) during development (`astro check --watch & astro dev`). For more info, see [this issue](https://github.com/satnaing/astro-paper/issues/113).

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Thanks to [Sat Naing](https://satnaing.dev) 🤍 and [contributors](https://github.com/satnaing/astro-paper/graphs/contributors) 👨🏻‍💻
