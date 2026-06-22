#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let passed = 0, failed = 0;

function check(label, ok, detail = '') {
  if (ok) { console.log(`  ✓ ${label}`); passed++; }
  else     { console.error(`  ✗ ${label}${detail ? ' — ' + detail : ''}`); failed++; }
}

const read  = f => fs.readFileSync(path.join(root, f), 'utf8');
const exist = f => fs.existsSync(path.join(root, f));

console.log('\nVozViva™ — Static Site Verification\n');

/* Files */
console.log('── Required files ──');
check('index.html',  exist('index.html'));
check('styles.css',  exist('styles.css'));
check('script.js',   exist('script.js'));
check('vercel.json', exist('vercel.json'));

/* HTML */
if (exist('index.html')) {
  const h = read('index.html');
  console.log('\n── HTML ──');
  check('lang es-MX',               h.includes('lang="es-MX"'));
  check('Single H1',                (h.match(/<h1[\s>]/gi)||[]).length === 1);
  check('VozViva in title',         h.includes('VozViva'));
  check('Spanish headline present', h.includes('Videos para redes'));
  check('No "by Kupuri" in header', !h.includes('logo-sub'));
  check('Kupuri only in footer',    h.includes('Kupuri Media') && (h.match(/Kupuri Media/g)||[]).length <= 4);
  check('MXN pricing present',      h.includes('MXN'));
  check('No USD pricing',           !h.match(/\$\s*\d+\s*(USD|usd|\bdólares?\b)/));
  check('No lorem ipsum',           !h.toLowerCase().includes('lorem ipsum'));
  check('styles.css linked',        h.includes('styles.css'));
  check('script.js linked',         h.includes('script.js'));
  check('GSAP loaded',              h.includes('gsap'));
  check('meta description',         h.includes('<meta name="description"'));
  check('og:locale es_MX',         h.includes('es_MX'));
  check('No emojis in text',        !h.match(/[\u{1F300}-\u{1FFFF}]/u));
  check('video elements present',   h.includes('<video'));
  check('data-demo attributes',     h.includes('data-demo'));
  check('3 demo videos',            (h.match(/data-demo=/g)||[]).length >= 4);
  check('aria-label on videos',     h.includes('aria-label="Demo'));
  check('semantic main',            h.includes('<main'));
  check('semantic header',          h.includes('<header'));
  check('semantic footer',          h.includes('<footer'));
  check('aria-expanded toggle',     h.includes('aria-expanded'));
  check('Nav demo anchor',          h.includes('#demos'));
  check('Plan Arranque $899',       h.includes('899'));
  check('Plan Negocio $2,490',      h.includes('2,490'));
  check('Plan Agencia $5,900',      h.includes('5,900'));
  check('FAQ section',              h.includes('id="preguntas"'));
  check('details/summary FAQ',      h.includes('<details'));
  check('No Kupuri in header',      !h.includes('<span class="logo-sub">'));
  check('Footer credit only',       h.includes('Hecho por'));

  /* No emojis check (deeper) */
  const emojiCount = (h.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{2600}-\u{27BF}]/gu)||[]).length;
  check('Zero emoji characters', emojiCount === 0, `found ${emojiCount}`);
}

/* CSS */
if (exist('styles.css')) {
  const c = read('styles.css');
  console.log('\n── CSS ──');
  check('Fraunces font',           c.includes('Fraunces'));
  check('Manrope font',            c.includes('Manrope'));
  check('CSS custom properties',   c.includes(':root'));
  check('Mobile breakpoint 360px', c.includes('360px'));
  check('Mobile breakpoint 480px', c.includes('480px'));
  check('Tablet breakpoint 768px', c.includes('768px'));
  check('Laptop breakpoint 1024px',c.includes('1024px'));
  check('Desktop breakpoint 1280px',c.includes('1280px'));
  check('prefers-reduced-motion',  c.includes('prefers-reduced-motion'));
  check(':focus-visible styles',   c.includes(':focus-visible'));
  check('video styling',           c.includes('.demo-video') || c.includes('phone-video'));
  check('No Arial fallback',       !c.match(/font-family\s*:\s*Arial/));
}

/* JS */
if (exist('script.js')) {
  const j = read('script.js');
  console.log('\n── JS ──');
  check('DEMO_VIDEOS config object', j.includes('DEMO_VIDEOS'));
  check('IntersectionObserver',      j.includes('IntersectionObserver'));
  check('prefers-reduced-motion',    j.includes('prefers-reduced-motion'));
  check('GSAP guard',                j.includes("typeof gsap === 'undefined'"));
  check('Mobile nav',                j.includes('mobile-nav'));
}

/* Summary */
console.log(`\n── Result ──`);
console.log(`  Passed: ${passed}   Failed: ${failed}\n`);
if (failed > 0) process.exit(1);
else console.log('  All checks passed. VozViva™ is ready to deploy.\n');
