import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'netlify-dist');
const vinext = resolve(root, 'node_modules', 'vinext', 'dist', 'cli.js');
const port = '4173';

function run(args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [vinext, ...args], {
      cwd: root,
      env: { ...process.env, CI: 'true', ...options.env },
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolveRun() : reject(new Error(`vinext ${args[0]} exited with ${code}`)));
  });
}

async function fetchPage(url) {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.text();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((done) => setTimeout(done, 500));
  }
  throw lastError ?? new Error('Production server did not become ready');
}

await run(['build']);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, 'dist', 'client'), output, { recursive: true });

const server = spawn(process.execPath, [vinext, 'start'], {
  cwd: root,
  env: { ...process.env, CI: 'true', PORT: port },
  stdio: 'inherit',
});

try {
  const localOrigin = `http://localhost:${port}`;
  const publicOrigin = (process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? 'https://prajesh-makootan.prajesh-makootan.chatgpt.site').replace(/\/$/, '');
  const html = (await fetchPage(`http://127.0.0.1:${port}/`))
    .replaceAll(localOrigin, publicOrigin)
    .replaceAll(`http://127.0.0.1:${port}`, publicOrigin);
  await writeFile(resolve(output, 'index.html'), html, 'utf8');
  await writeFile(resolve(output, '_redirects'), '/* /index.html 200\n', 'utf8');
} finally {
  server.kill('SIGTERM');
}

console.log(`Netlify static output created at ${output}`);
