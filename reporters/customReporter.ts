import fs from 'fs';
import path from 'path';
import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';
 
export default class CustomReporter implements Reporter {
  private results: any[] = [];
 
  onTestEnd(test: TestCase, result: TestResult) {
    const record: any = {
      title: test.title,
      status: result.status,
      error: result.error?.message || null,
      screenshots: [],
      video: null
    };
 
    
    for (const attachment of result.attachments) {
      if (attachment.name === 'screenshot' && attachment.path) {
        record.screenshots.push(path.relative(process.cwd(), attachment.path));
      }
      if (attachment.name === 'video' && attachment.path) {
        record.video = path.relative(process.cwd(), attachment.path);
      }
    }
 
    this.results.push(record);
  }
 
  onEnd() {
    fs.writeFileSync('test-results.json', JSON.stringify(this.results, null, 2));
    console.log(`\nЗбережено результати тестів у test-results.json`);
  }
}
 
//export default CustomReporter;
 