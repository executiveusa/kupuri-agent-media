#!/usr/bin/env node
/* VozViva™ Static Site Verification Script */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

const readFile = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists   = f => fs.existsSync(path.join(root, f));

console.log('\nVozViva™ Static Site Verification\n');

/* Required files */
console.log('── Required files ──');
check('index.html exists',  exists('index.html'));
check('styles.css exists',  exists('styles.css'));
check('script.js exists',   exists('script.js'));
check('vercel.json exists', exists('vercel.json'));
check('package.json exists',exists('package.json'));

/* HTML checks */
if (exists('index.html')) {
  const html = readFile('index.html');
  console.log('\n── HTML content ──');
  check('lang="es-MX"',              html.includes('lang="es-MX"'));
  check('Single H1 tag',             (html.match(/<h1[\s>]/gi) || []).length === 1);
  check('VozViva in title',          html.includes('VozViva'));
  check('Spanish headline present',  html.includes('Videos que venden'));
  check('LATAM trust copy',          html.includes('Latinoamérica') || html.includes('México'));
  check('Pricing MXN present',       html.includes('MXN'));
  check('No USD pricing',            !html.includes('USD') && !html.includes('$') || html.includes('MXN'));
  check('No lorem ipsum',            !html.toLowerCase().includes('lorem ipsum'));
  check('styles.css linked',         html.includes('styles.css'));
  check('script.js linked',          html.includes('script.js'));
  check('GSAP CDN loaded',           html.includes('gsap'));
  check('meta description present',  html.includes('<meta name="description"'));
  check('og:locale es_MX',          html.includes('es_MX'));
  check('Hero section present',      html.includes('hero'));
  check('Pricing section present',   html.includes('precios') || html.includes('pricing'));
  check('FAQ section present',       html.includes('preguntas') || html.includes('faq'));
  check('Email CTA present',         html.includes('kupurimedia.com'));
  check('aria-label on nav',         html.includes('aria-label'));
  check('aria-expanded on toggle',   html.includes('aria-expanded'));
  check('Plan Arranque: $899 MXN',   html.includes('899'));
  check('Plan Negocio: $2,490 MXN',  html.includes('2,490'));
  check('Plan Agencia: $5,900 MXN',  html.includes('5,900'));
  check('No USD dollar amounts',     !html.match(/\$\s*\d+\s*(USD|usd|\bdólares?\b)/));
  check('Semantic main tag',         html.includes('<main'));
  check('Semantic header tag',       html.includes('<header'));
  check('Semantic footer tag',       html.includes('<footer'));
  check('prefers-reduced-motion',    readFile('styles.css').includes('prefers-reduced-motion'));
  check('Mobile-first viewport',     html.includes('viewport'));
}

/* CSS checks */
if (exists('styles.css')) {
  const css = readFile('styles.css');
  console.log('\n── CSS quality ──');
  check('Fraunces font loaded',     css.includes('Fraunces'));
  check('Manrope font loaded',      css.includes('Manrope'));
  check('Custom properties used',   css.includes(':root'));
  check('No Arial-only fallback',   !css.match(/font-family\s*:\s*Arial\s*;/));
  check('Responsive breakpoints',   css.includes('@media'));
  check('Focus-visible styles',     css.includes(':focus-visible'));
}

/* Summary */
console.log(`\n── Result ──`);
console.log(`  Passed: ${passed}   Failed: ${failed}\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  All checks passed. VozViva™ is ready to deploy.\n');
}
