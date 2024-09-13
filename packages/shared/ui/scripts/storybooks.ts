import { spawn, ChildProcess } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const startStorybook = (name: string, command: string, dir: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(' ');
        const storybookProcess: ChildProcess = spawn(cmd, args, { cwd: dir, env: { ...process.env }, shell: true });

        storybookProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            console.log(`${name}: ${output}`);

            if (output.includes(`started`)) {
                resolve();
            }
        });

        storybookProcess.stderr?.on('data', (data) => {
            console.error(`${name} stderr:`, data.toString());
        });

        storybookProcess.on('error', (error) => {
            console.error(`${name} failed:`, error);
            reject(error);
        });

        storybookProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`${name} exited with code ${code}`);
            }
        });
    });
};

const findStorybookDirs = (baseDir: string): string[] => {
    return readdirSync(baseDir)
        .map((name) => join(baseDir, name))
        .filter((dir) => statSync(dir).isDirectory() && readdirSync(dir).includes('.storybook'));
};

const startAllStorybooks = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const baseDir = join(__dirname, '../../../');
    const storybookDirs = findStorybookDirs(baseDir);

    console.log(`Found Storybooks in the following directories: ${storybookDirs.join(', ')}`);

    let port = 6007;

    for (const dir of storybookDirs) {
        const projectName = dir.split('/').pop() || dir;
        console.log(`Starting Storybook for ${projectName} on port ${port}`);
        await startStorybook(`Storybook for ${projectName}`, `npm run storybook -- --no-open --disable-telemetry -p ${port}`, dir);
        port += 1;
    }

    console.log(`All sub-Storybooks started. Starting the main Storybook...`);

    const mainStorybookProcess = spawn('npm', ['run', 'storybook -- --disable-telemetry'], { env: { ...process.env, PORT: port.toString() }, shell: true });

    mainStorybookProcess.stdout?.on('data', (data) => {
        console.log(`Main Storybook: ${data}`);
    });

    mainStorybookProcess.stderr?.on('data', (data) => {
        console.error('Main Storybook stderr:', data.toString());
    });

    mainStorybookProcess.on('error', (error) => {
        console.error('Main Storybook failed:', error);
    });

    mainStorybookProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Main Storybook exited with code ${code}`);
        }
    });
};

startAllStorybooks().then();