import { cp, mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { execFileSync } from 'node:child_process'

const repository = 'https://github.com/eurekaffeine/sapphire-star-codex.git'
const run = (command, args, cwd, capture = false) => execFileSync(command, args, {
  cwd, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8',
})
run('npm', ['run', 'build'], process.cwd())
run('gh', ['auth', 'setup-git'], process.cwd())
const directory = await mkdtemp(join(tmpdir(), 'ssc-site-publish-'))
try {
  run('git', ['init', '--initial-branch=gh-pages'], directory)
  run('git', ['remote', 'add', 'origin', repository], directory)
  const existing = run('git', ['ls-remote', '--heads', 'origin', 'gh-pages'], directory, true).trim()
  if (existing) {
    run('git', ['fetch', '--depth=1', 'origin', 'gh-pages'], directory)
    run('git', ['checkout', '-B', 'gh-pages', 'FETCH_HEAD'], directory)
  }
  // The temp checkout contains only the generated site, never source app data.
  for (const entry of await readdir(directory)) {
    if (entry !== '.git') await rm(join(directory, entry), { recursive: true, force: true })
  }
  await cp(resolve('.vitepress/dist'), directory, {
    recursive: true, filter: source => !source.split('/').includes('.git'),
  })
  run('git', ['add', '.'], directory)
  if (run('git', ['status', '--porcelain'], directory, true).trim()) {
    run('git', ['-c', 'user.name=Sapphire Star Codex deploy', '-c', 'user.email=eurekaffeine@users.noreply.github.com', 'commit', '-m', 'deploy: update official website'], directory)
    run('git', ['push', 'origin', 'gh-pages'], directory)
  }
  console.log('Published built output to eurekaffeine/sapphire-star-codex:gh-pages.')
} finally {
  await rm(directory, { recursive: true, force: true })
}
