#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_ENDPOINT = 'https://template-generator-api.trasd208.workers.dev';
const EXPECTED_MIN_LENGTH = 100;

async function runSmokeTest() {
  console.log('🧪 Starting smoke test...');
  
  try {
    // サンプルペイロード読み込み
    const payloadPath = join(__dirname, '../fixtures/payload.sample.json');
    const samplePayload = JSON.parse(readFileSync(payloadPath, 'utf8'));
    
    console.log('📡 Sending request to API...');
    
    // API呼び出し
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://temp-gen.pages.dev'
      },
      body: JSON.stringify(samplePayload)
    });
    
    // ステータスコードチェック
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ Status: 200 OK');
    
    // レスポンス解析
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API Error: ${data.error}`);
    }
    
    console.log('✅ Response format: Valid JSON with success=true');
    
    // 本文長チェック
    const template = data.template || '';
    if (template.length < EXPECTED_MIN_LENGTH) {
      throw new Error(`Template too short: ${template.length} < ${EXPECTED_MIN_LENGTH} chars`);
    }
    
    console.log(`✅ Template length: ${template.length} chars (>= ${EXPECTED_MIN_LENGTH})`);
    
    // 基本セクション存在確認
    const requiredSections = ['【商品説明】', '【商品状態】', '【返品について】'];
    const missingSections = requiredSections.filter(section => !template.includes(section));
    
    if (missingSections.length > 0) {
      throw new Error(`Missing sections: ${missingSections.join(', ')}`);
    }
    
    console.log('✅ Required sections: All present');
    
    console.log('\n🎉 Smoke test PASSED!');
    console.log(`\n📄 Generated template preview:\n${template.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('\n❌ Smoke test FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

runSmokeTest();