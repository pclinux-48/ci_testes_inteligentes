const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.join(projectRoot, 'RELATORIO_TECNICO.md');
const htmlPath = path.join(projectRoot, 'RELATORIO_TECNICO.html');
const pdfPath = path.join(projectRoot, 'RELATORIO_TECNICO.pdf');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    html.push(`<p>${paragraph.join(' ')}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!inList) {
      return;
    }

    html.push('</ul>');
    inList = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      closeList();
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      closeList();
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    paragraph.push(escapeHtml(line));
  }

  flushParagraph();
  closeList();

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Relatorio Tecnico</title>
    <style>
      @page {
        size: A4;
        margin: 1.8cm;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #111827;
        font-size: 12pt;
        line-height: 1.45;
      }

      h1 {
        font-size: 18pt;
        margin: 0 0 12px;
        text-align: center;
      }

      h2 {
        font-size: 13pt;
        margin: 16px 0 8px;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 4px;
      }

      p {
        margin: 0 0 10px;
        text-align: justify;
      }

      ul {
        margin: 0 0 10px 18px;
        padding: 0;
      }

      li {
        margin-bottom: 6px;
      }
    </style>
  </head>
  <body>
    ${html.join('\n')}
  </body>
</html>`;
}

async function main() {
  const markdown = fs.readFileSync(inputPath, 'utf8');
  const html = markdownToHtml(markdown);

  fs.writeFileSync(htmlPath, html, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1.8cm',
      right: '1.8cm',
      bottom: '1.8cm',
      left: '1.8cm',
    },
  });

  await browser.close();

  console.log(`HTML gerado em: ${htmlPath}`);
  console.log(`PDF gerado em: ${pdfPath}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
