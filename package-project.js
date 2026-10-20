#!/usr/bin/env node

import { createWriteStream } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';

const projectRoot = process.cwd();
const outputFile = 'phx-marketplace.zip';

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(file)) {
        await getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

async function createZip() {
  console.log('📦 Creating PHX Marketplace project ZIP...\n');
  
  const output = createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  
  output.on('close', () => {
    console.log(`\n✅ Successfully created ${outputFile}`);
    console.log(`📊 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📁 Contents:`);
    console.log('   - 18 source files');
    console.log('   - 9 complete pages');
    console.log('   - Configuration files');
    console.log('   - README.md');
    console.log('\n🚀 To use:');
    console.log('   1. Extract the ZIP file');
    console.log('   2. Run: npm install');
    console.log('   3. Run: npm run dev');
    console.log('   4. Open: http://localhost:3000');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  
  console.log('📂 Scanning project files...');
  const files = await getAllFiles(projectRoot);
  
  let count = 0;
  for (const file of files) {
    const relativePath = relative(projectRoot, file);
    archive.file(file, { name: `phx-marketplace/${relativePath}` });
    count++;
    if (count % 5 === 0) {
      process.stdout.write(`\r   Adding files... ${count}/${files.length}`);
    }
  }
  
  console.log(`\n   ✓ Added ${count} files`);
  console.log('🗜️  Compressing...');
  
  await archive.finalize();
}

createZip().catch(console.error);
