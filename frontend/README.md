# DevBoard frontend

## Theme tokens

DevBoard uses Catppuccin Latte in light mode and Mocha in dark mode. Raw `--ctp-*` palette variables and the semantic tokens that consume them live in `src/style.css`. Components should use semantic Tailwind utilities such as `bg-app`, `bg-surface`, `bg-elevated`, `text-text`, `text-muted`, `border-border-subtle`, and `bg-primary` rather than raw palette values or hex colors.

The selected theme is stored under `DevBoard-theme`; on a first visit it follows the operating-system color preference.
