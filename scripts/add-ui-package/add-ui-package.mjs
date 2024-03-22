#!/usr/bin/env node

import ora from 'ora';
import { exec } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import util from 'util';

const execP = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runtimeDependencies = [
    'react-router-dom',
    'react-map-gl',
    '@types/mapbox-gl',
    'mapbox-gl',
];

const devDependencies = [
    'vite-tsconfig-paths',
    'vitest',
    'jsdom',
    '@testing-library/react',
    '@testing-library/user-event',
    '@testing-library/jest-dom',
    'eslint',
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'prettier',
    '@vitejs/plugin-react-swc',
    'sass'
];

async function runCommand(command, message, suppressOutput = false) {
    const spinner = ora(message).start();

    try {
        const stdioConfig = suppressOutput ? ['pipe', 'ignore', 'pipe'] : ['pipe', 'pipe', 'pipe'];
        const { stdout, stderr } = await execP(command, { stdio: stdioConfig });
        if (stderr) throw new Error(stderr);
        if (!suppressOutput) {
            console.log(stdout);
        }
        spinner.succeed(`Success: ${message}`);
        return true;
    } catch (error) {
        spinner.fail(`Failed: ${message}`);
        console.error(`Error executing command "${command}": ${error.message}`);
        return false;
    }
}

async function installDependencies(dependencies, isDev = false) {
    const devFlag = isDev ? '-D' : '';
    const command = `npm install ${devFlag} ${dependencies.join(' ')}`;
    console.log(`Rounding out ${isDev ? 'development' : 'runtime'} dependencies...`);
    if (!(await runCommand(command))) {
        console.error(`Failed to install ${isDev ? 'development' : 'runtime'} dependencies`);
        process.exit(1);
    }
}

async function copyTemplateFiles(sourceDir, destDir) {
    try {
        const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
        entries.forEach(entry => {
            const sourcePath = path.join(sourceDir, entry.name);
            const destPath = path.join(destDir, entry.name);

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyTemplateFiles(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
        return true;
    } catch (error) {
        console.error(`Error copying template files: ${error.message}`);
        return false;
    }
}

async function createStorybookConfig(appDir) {
    const storybookDir = path.join(appDir, '.storybook');
    const mainJsPath = path.join(storybookDir, 'main.js');

    if (!fs.existsSync(storybookDir)) {
        fs.mkdirSync(storybookDir);
    }

    const mainJsContent = `
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
};
  `;

    fs.writeFileSync(mainJsPath, mainJsContent);
    console.log('Storybook configuration created.');
}

async function addConfigPath(mapping, pathToAdd) {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');

    try {
        const tsConfigContent = await fs.readFile(tsConfigPath, 'utf8');

        const tsConfig = JSON.parse(tsConfigContent);

        if (!tsConfig.compilerOptions) {
            tsConfig.compilerOptions = {};
        }

        if (!tsConfig.compilerOptions.paths) {
            tsConfig.compilerOptions.paths = {};
        }

        tsConfig.compilerOptions.paths[mapping] = [pathToAdd];

        await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf8');
        console.log(`tsconfig.json has been updated with mapping: ${mapping} -> ${pathToAdd}`);
    } catch (error) {
        console.error('Failed to update tsconfig.json:', error);
    }
}

async function addUiPackage(appName, templateSubfolder = 'default') {
    if (!appName) {
        console.log("Usage: node setupViteApp.js <AppName> [TemplateSubfolder]");
        return;
    }

    const appDir = path.join(process.cwd(), appName);
    if (fs.existsSync(appDir)) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(`The project "${appName}" already exists.`);
        const confirmedAppName = await new Promise((resolve) => {
            rl.question(`To confirm deletion, please type the project name ("${appName}"): `, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });

        if (confirmedAppName !== appName) {
            console.log('Project name does not match. Operation cancelled.');
            return;
        }

        fs.rmSync(appDir, { recursive: true, force: true });
        console.log(`Deleted existing project "${appName}".`);
    }

    console.log(`Creating Vite project: ${appName}`);
    if (!(await runCommand(`npx create-vite@latest ${appName} --template react-ts`, `Creating Vite project: ${appName}`, true))) {
        process.exit(1);
    }

    process.chdir(appDir);

    await installDependencies(runtimeDependencies);
    await installDependencies(devDependencies, true);

    await createStorybookConfig(appDir);

    console.log(`Prepare for Playwright...`);
    if (!(await runCommand(`npm install`, `NPM install`, false))) {
        process.exit(1);
    }

    const templatesDir = path.join(__dirname, 'templates', templateSubfolder);
    console.log(`Copying template files from ${templateSubfolder}...`);
    if (!(await copyTemplateFiles(templatesDir, appDir))) {
        process.exit(1);
    }

    console.log("Starting the development server and opening the app at http://localhost:5175...");
    if (!(await runCommand('npm run dev -- --open'))) {
        console.error("Failed to start the development server or open the browser.");
        process.exit(1);
    }

    console.log("Setup complete.");
}

const appName = process.argv[2];
const templateSubfolder = process.argv[3] || 'default';
addUiPackage(appName, templateSubfolder).catch(console.error);
