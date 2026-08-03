// Auto-discovers whatever files exist in src/assets/portfolio/, keyed by
// filename without extension. Drop a correctly-named file in and it shows
// up on next reload — no code change needed. Items without a matching file
// fall back to PlaceholderBox.
const modules = import.meta.glob('../../../assets/portfolio/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const files = {}
for (const path in modules) {
  const key = path.split('/').pop().replace(/\.(jpe?g|png|webp)$/i, '')
  files[key] = modules[path]
}

export function getPortfolioImage(asset, variant) {
  return files[`${asset}-${variant}`]
}
