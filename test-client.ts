/**
 * Test script for SearXNG client (GET and POST methods)
 *
 * Usage: npx tsx test-client.ts [searxng_url]
 */

import { SearxngClient } from './src/searxng-client.js';

const SEARXNG_URL = process.argv[2] || 'http://localhost:8888';

function formatError(err: unknown): string {
  if (err instanceof Error) {
    const parts = [`Error: ${err.message}`];

    // Check for cause
    if (err.cause) {
      const cause = err.cause as { code?: string; errno?: number };
      if (cause.code) parts.push(`  Code: ${cause.code}`);
      if (cause.errno !== undefined) parts.push(`  Errno: ${cause.errno}`);
    }

    // Check for TypeError specifics
    if (err instanceof TypeError) {
      parts.push(`  Type: TypeError`);
    }

    // Stack trace (first 3 lines)
    if (err.stack) {
      const stackLines = err.stack.split('\n').slice(0, 3);
      parts.push('  Stack:');
      stackLines.forEach(line => parts.push(`    ${line.trim()}`));
    }

    return parts.join('\n');
  }
  return String(err);
}

async function test() {
  console.log(`Testing SearXNG client at ${SEARXNG_URL}\n`);
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform}\n`);

  // Test health check first
  console.log('=== Testing health check ===');
  const healthClient = new SearxngClient({ searxngUrl: SEARXNG_URL });
  try {
    const healthy = await healthClient.healthCheck();
    console.log(`✓ Health check: ${healthy ? 'OK' : 'FAILED'}`);
    if (!healthy) {
      console.log('  Server responded but health check returned false');
    }
  } catch (err) {
    console.log(`✗ Health check failed:\n${formatError(err)}`);
  }

  console.log('');

  // Test GET (default)
  console.log('=== Testing GET method ===');
  const getClient = new SearxngClient({
    searxngUrl: SEARXNG_URL,
    method: 'GET',
    engines: ['google', 'startpage'],
  });

  try {
    console.log(`  Requesting: GET ${SEARXNG_URL}/search?q=OpenClaw+AI&format=json...`);
    const getResult = await getClient.search('OpenClaw AI', { count: 3 });
    console.log(`✓ GET: Found ${getResult.count} results in ${getResult.tookMs}ms`);
    if (getResult.results[0]) {
      console.log(`  First result: ${getResult.results[0].title}`);
      console.log(`  URL: ${getResult.results[0].url}`);
    }
  } catch (err) {
    console.log(`✗ GET failed:\n${formatError(err)}`);
  }

  console.log('');

  // Test POST
  console.log('=== Testing POST method ===');
  const postClient = new SearxngClient({
    searxngUrl: SEARXNG_URL,
    method: 'POST',
    engines: ['google', 'startpage'],
  });

  try {
    console.log(`  Requesting: POST ${SEARXNG_URL}/search with body q=OpenClaw+AI&format=json...`);
    const postResult = await postClient.search('OpenClaw AI', { count: 3 });
    console.log(`✓ POST: Found ${postResult.count} results in ${postResult.tookMs}ms`);
    if (postResult.results[0]) {
      console.log(`  First result: ${postResult.results[0].title}`);
      console.log(`  URL: ${postResult.results[0].url}`);
    }
  } catch (err) {
    console.log(`✗ POST failed:\n${formatError(err)}`);
  }
}

test().catch(err => {
  console.error('Unhandled error:');
  console.error(formatError(err));
  process.exit(1);
});
