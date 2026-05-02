import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://romaincoupey.com/", // replace this with your deployed domain
  author: "Romain Coupey",
  profile: "https://github.com/Ngopimas/",
  desc: "Web Dev & Curious Tinkerer",
  title: "Romain C.",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  editPost: {
    url: "https://github.com/Ngopimas/profile-minimal/edit/master/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Mail",
    href: "mailto:contact@romaincoupey.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/romain-coupey/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/Ngopimas/",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
];
