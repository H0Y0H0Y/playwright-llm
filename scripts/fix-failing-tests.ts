/* eslint-disable no-console */
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface CTRFTest {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending' | 'other';
  suite: string;
  filePath: string;
  duration?: number;
}

interface CTRFReport {
  results: {
    summary: {
      tests: number;
      passed: number;
      failed: number;
      pending: number;
      skipped: number;
      other: number;
    };
    tests: CTRFTest[];
  };
}

function main() {
  const reportPath = path.join(process.cwd(), 'ctrf', 'ctrf-report.json');

  let report: CTRFReport;

  try {
    report = JSON.parse(readFileSync(reportPath, 'utf-8'));
  } catch {
    console.error(`No CTRF report found at ${reportPath}`);
    process.exit(1);
  }

  const failedTests: { name: string; message: string; stack?: string }[] = [];

  for (const test of report.results.tests) {
    if (test.status === 'failed') {
      failedTests.push({
        name: `${test.suite} - ${test.name}`,
        message: 'Test failed', // CTRF report doesn't include failure message
        stack: undefined,
      });
    }
  }

  if (failedTests.length === 0) {
    console.log('No failing tests found.');

    return;
  }

  console.log(`Found ${failedTests.length} failing test(s):`);
  failedTests.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name}`);
    console.log(`     Error: ${t.message}`);
  });

  const branchName = `fix/test-failures-${Date.now()}`;

  console.log(`\nCreating branch: ${branchName}`);
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

  const testDetails = failedTests
    .map((t) => `## ${t.name}\n\`\`\`\n${t.message}\n${t.stack ?? ''}\n\`\`\``)
    .join('\n\n');
  const fixPrompt = `Fix the following failing Playwright tests:\n\n${testDetails}\n\nThe test files are in the tests/ directory. After fixing, run the tests to verify they pass.`;

  console.log('\nInvoking opencode to fix tests...');
  const tmpFile = path.join(process.cwd(), '.opencode-prompt.txt');
  
  writeFileSync(tmpFile, fixPrompt);
  execSync(`opencode run "$(cat ${tmpFile})"`, { stdio: 'inherit', shell: '/bin/bash' });
  unlinkSync(tmpFile);
}

main();
