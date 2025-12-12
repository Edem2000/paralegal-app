import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const rootEnv = path.join(__dirname, '..', '.env');

if (!fs.existsSync(rootEnv)) {
    console.error('❌ .env file is not found in the root. It must be created before build.');
    process.exit(1);
}

const targets = [
    path.join(__dirname, '..', 'frontend', '.env.production'),
    path.join(__dirname, '..', 'backend', '.env'),
];

const envContent = fs.readFileSync(rootEnv, 'utf-8');

for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(target, envContent, 'utf-8');
    console.log(`✅ Copied .env → ${path.relative(path.join(__dirname, '..'), target)}`);
}
