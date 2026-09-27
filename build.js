import esbuild from 'esbuild';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

const require = createRequire(import.meta.url);
const pkg = require(path.join(rootDir, 'package.json'));

const isWatch = process.argv.includes('--watch');

const common = {
  bundle: true,
  minify: true,
  target: 'chrome114',
  platform: 'browser',
  legalComments: 'none',
  format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"' },
};

async function copyStaticFiles() {
  const outDir = path.resolve(rootDir, 'dist');
  try {
    await fs.emptyDir(outDir);

    const manifest = await fs.readJson(path.join(rootDir, 'manifest.json'));
    manifest.version = pkg.version;
    await fs.writeJson(path.join(outDir, 'manifest.json'), manifest, { spaces: 2 });

    await fs.copy(path.join(rootDir, 'src/ui/popup/popup.html'), path.join(outDir, 'popup.html'));
    await fs.copy(path.join(rootDir, 'icon'), path.join(outDir, 'icon'));
  } catch (error) {
    console.error('Error copying static files:', error);
    process.exit(1);
  }
}

async function build() {
  try {
    await copyStaticFiles();

    const esbuildConfig = {
      ...common,
      entryPoints: {
        'content-bridge': 'src/entries/content-bridge.js',
        'inject': 'src/entries/inject-entry.js',
        'popup': 'src/ui/popup/popup.js'
      },
      outdir: 'dist',
    };

    if (isWatch) {
      const ctx = await esbuild.context(esbuildConfig);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(esbuildConfig);
      console.log('Build complete -> dist/');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();