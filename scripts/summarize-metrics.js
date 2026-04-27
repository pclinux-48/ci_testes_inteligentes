const fs = require('fs');
const path = require('path');

function getArg(flag, fallback = '') {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectFilesRecursively(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return [];
  }

  const stats = fs.statSync(targetPath);
  if (stats.isFile()) {
    return [targetPath];
  }

  const files = [];
  for (const entry of fs.readdirSync(targetPath)) {
    files.push(...collectFilesRecursively(path.join(targetPath, entry)));
  }
  return files;
}

function walkSuites(suites, callback) {
  for (const suite of suites || []) {
    callback(suite);
    walkSuites(suite.suites || [], callback);
  }
}

function summarizeSpecs(report) {
  const scenarios = [];
  const tags = new Set();
  const projects = new Set();
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let timedOut = 0;
  let interrupted = 0;
  let totalResultDurationMs = 0;

  walkSuites(report.suites || [], suite => {
    for (const spec of suite.specs || []) {
      scenarios.push(spec.title);
      for (const tag of spec.tags || []) {
        tags.add(tag);
      }

      for (const test of spec.tests || []) {
        totalTests += 1;
        if (test.projectName) {
          projects.add(test.projectName);
        }

        const lastResult = (test.results || [])[test.results.length - 1];
        if (lastResult?.duration) {
          totalResultDurationMs += lastResult.duration;
        }

        switch (lastResult?.status) {
          case 'passed':
            passed += 1;
            break;
          case 'skipped':
            skipped += 1;
            break;
          case 'timedOut':
            timedOut += 1;
            failed += 1;
            break;
          case 'interrupted':
            interrupted += 1;
            failed += 1;
            break;
          default:
            if (lastResult?.status) {
              failed += 1;
            }
            break;
        }
      }
    }
  });

  return {
    scenarios,
    tags: Array.from(tags),
    projects: Array.from(projects),
    totalTests,
    passed,
    failed,
    skipped,
    timedOut,
    interrupted,
    totalResultDurationMs,
  };
}

function countArtifacts(files) {
  const lower = files.map(file => file.toLowerCase());
  return {
    screenshots: lower.filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')).length,
    videos: lower.filter(file => file.endsWith('.webm') || file.endsWith('.mp4')).length,
    traces: lower.filter(file => file.endsWith('.zip')).length,
    markdownContexts: lower.filter(file => file.endsWith('.md')).length,
  };
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function toMarkdown(summary) {
  return [
    `## Resumo de Metricas - ${summary.pipelineName}`,
    '',
    `- Suite: ${summary.suiteKey}`,
    `- Testes executados: ${summary.totalTests}`,
    `- Aprovados: ${summary.passed}`,
    `- Falhos: ${summary.failed}`,
    `- Flaky: ${summary.flaky}`,
    `- Ignorados: ${summary.skipped}`,
    `- Duracao total: ${formatDuration(summary.durationMs)}`,
    `- Duracao media por teste: ${formatDuration(summary.averageDurationMs)}`,
    `- Taxa de sucesso: ${summary.passRate}%`,
    `- Projetos: ${summary.projects.join(', ') || 'n/a'}`,
    `- Tags: ${summary.tags.join(', ') || 'n/a'}`,
    `- Evidencias geradas: screenshots=${summary.artifacts.screenshots}, videos=${summary.artifacts.videos}, traces=${summary.artifacts.traces}`,
    `- Tipo de cobertura: ${summary.coverage.type}`,
    `- Cobertura funcional: ${summary.coverage.scenariosCovered}/${summary.coverage.totalScenarios} cenarios`,
    '',
    '### Cenarios Cobertos',
    ...summary.coverage.items.map(item => `- ${item}`),
    '',
    `Observacao: ${summary.coverage.note}`,
    '',
  ].join('\n');
}

function main() {
  const suiteKey = getArg('--suite', 'default');
  const pipelineName = getArg('--name', suiteKey);
  const inputPath = path.resolve(getArg('--input', 'test-results/results.json'));
  const outputDir = path.resolve(getArg('--output-dir', 'metrics'));
  const artifactsPath = path.resolve(getArg('--artifacts-path', 'test-results'));
  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;

  ensureDir(outputDir);

  const report = readJson(inputPath);
  const specSummary = summarizeSpecs(report);
  const artifactFiles = collectFilesRecursively(artifactsPath);
  const artifacts = countArtifacts(artifactFiles);
  const durationMs = Math.round(report.stats?.duration || specSummary.totalResultDurationMs || 0);
  const totalTests = specSummary.totalTests || 0;
  const averageDurationMs = totalTests ? Math.round(durationMs / totalTests) : 0;
  const passRate = totalTests ? ((specSummary.passed / totalTests) * 100).toFixed(2) : '0.00';

  const summary = {
    generatedAt: new Date().toISOString(),
    pipelineName,
    suiteKey,
    totalTests,
    passed: specSummary.passed,
    failed: specSummary.failed,
    skipped: report.stats?.skipped ?? specSummary.skipped,
    flaky: report.stats?.flaky ?? 0,
    unexpected: report.stats?.unexpected ?? specSummary.failed,
    expected: report.stats?.expected ?? specSummary.passed,
    durationMs,
    durationSeconds: Number((durationMs / 1000).toFixed(2)),
    averageDurationMs,
    averageDurationSeconds: Number((averageDurationMs / 1000).toFixed(2)),
    passRate,
    projects: specSummary.projects,
    tags: specSummary.tags,
    artifacts,
    coverage: {
      type: 'funcional',
      totalScenarios: specSummary.scenarios.length,
      scenariosCovered: specSummary.scenarios.length,
      items: specSummary.scenarios,
      note: 'Resumo automatico de cobertura funcional dos cenarios executados. Cobertura de codigo nao foi habilitada neste projeto.',
    },
  };

  const summaryJsonPath = path.join(outputDir, `${suiteKey}-metrics-summary.json`);
  const summaryMdPath = path.join(outputDir, `${suiteKey}-metrics-summary.md`);
  const markdown = toMarkdown(summary);

  fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryMdPath, `${markdown}\n`, 'utf8');

  if (stepSummaryPath) {
    fs.appendFileSync(stepSummaryPath, `${markdown}\n`, 'utf8');
  }

  console.log(`Resumo JSON salvo em: ${summaryJsonPath}`);
  console.log(`Resumo Markdown salvo em: ${summaryMdPath}`);
}

main();
