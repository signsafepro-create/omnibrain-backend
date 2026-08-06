const http = require('http');

const API = process.env.TEST_API_URL || 'http://localhost:3001';
let token = null;
let userId = null;
let testResults = [];

function test(name, fn) {
  return async () => {
    try {
      await fn();
      testResults.push({ name, status: 'PASS', points: 1 });
      console.log('  ✅', name);
    } catch (err) {
      testResults.push({ name, status: 'FAIL', points: 0, error: err.message });
      console.log('  ❌', name, '-', err.message);
    }
  };
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg}: expected ${expected}, got ${actual}`);
}

function assertTrue(val, msg) {
  if (!val) throw new Error(msg || 'Expected true, got false');
}

function assertHas(obj, key, msg) {
  if (!(key in obj)) throw new Error(msg || `Missing key: ${key}`);
}

async function post(path, body, auth = false) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    if (auth && token) opts.headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(opts, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, body: raw, headers: res.headers }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function get(path, auth = false) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'GET',
      headers: {}
    };
    if (auth && token) opts.headers['Authorization'] = `Bearer ${token}`;
    http.get(opts, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, body: raw, headers: res.headers }); }
      });
    }).on('error', reject);
  });
}

module.exports = { test, assertEqual, assertTrue, assertHas, post, get, token, userId, testResults, API };
