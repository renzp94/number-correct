import * as path from 'node:path'

interface CoverageOptions {
  label?: string
  tagConfigs?: Array<{ ratio: number; color: string }>
  outDir?: string
}

const coverage = async (options?: CoverageOptions): Promise<boolean> => {
  const {
    label = 'coverage',
    tagConfigs = [
      { ratio: 0, color: '#ffc245' },
      { ratio: 50, color: '#ffc245' },
      { ratio: 90, color: '#00c48c' },
    ],
    outDir = process.cwd(),
  } = options ?? {}

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="104" height="20">
  <script/>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="60" height="20" fill="#555"/>
  <rect rx="3" x="50" width="54" height="20" fill="@color@"/>
  <path fill="@color@" d="M64 0h4v20h-4z"/>
  <rect rx="0" x="5" width="50" height="20" fill="#555"/>
  <rect rx="3" width="104" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="27" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="27" y="14">${label}</text>
    <text x="80" y="15" fill="#010101" fill-opacity=".3">@ratio@</text>
    <text x="80" y="14">@ratio@</text>
  </g>
</svg>
`.trim()
  try {
    const result = await Bun.$`bun test --coverage`
    const text = result.stderr.toString()
    const lines = text.trim().split('\n')
    // 获取All files行
    const line = lines.find((line) => line.includes('All files'))
    if (!line) {
      throw new Error('未找到All files行')
    }

    // 截取覆盖率(以Lines为准)
    const ratio = Number(
      line.split('|')[2].trim().split(' ')[0].replace('%', ''),
    )
    if (ratio > 100 || ratio < 0) {
      throw new Error('覆盖率范围为0~100')
    }

    const ratioTarget = tagConfigs
      .sort((a, b) => b.ratio - a.ratio)
      .find((item) => ratio >= item.ratio)

    const badge = svg
      .replace(/@ratio@/g, `${ratio}%`)
      .replace(/@color@/g, ratioTarget?.color ?? '555')

    await Bun.write(path.resolve(outDir, `${label}.svg`), badge)
    await Bun.write(path.resolve(outDir, `./docs/public/${label}.svg`), badge)
    let lineIndex = lines.findIndex((line) => line.includes('All files'))
    let endIndex = lines.findIndex((line) => line.includes('tests across'))

    if (lineIndex > -1) {
      lineIndex = lineIndex - 2
    }

    if (endIndex > -1) {
      endIndex = endIndex - 5
    }

    let md = `# ${label}\n\n`

    md += lines.slice(lineIndex, endIndex).join('\n')
    await Bun.write(path.resolve(outDir, `${label}.md`), md)
    await Bun.$`git add ${label}.md ${label}.svg ./docs/public/${label}.svg  && git commit -m "coverage: update coverage"`
    return true
  } catch {
    return false
  }
}

coverage()
