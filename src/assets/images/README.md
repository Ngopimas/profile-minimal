# Image asset conventions

Use folders by narrative ownership, not by file type.

- `projects/<project-slug>/` - visuals owned by a project page. Blog posts can reference these when they discuss the same project.
- `posts/<post-slug>/` - visuals that only support one article.
- `shared/` - genuinely reusable assets such as profile images.
- `public/assets/images/project-thumbs/` - stable public thumbnail and Open Graph paths used by frontmatter strings.

Keep filenames semantic and short, for example `robustness-check.png`, `agent-log-preview.png`, or `pre-rebalance-gate.svg`.
