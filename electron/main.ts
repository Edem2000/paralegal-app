import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = !app.isPackaged;

function startBackend() {
    if (isDev) {
        console.log('[backend] dev mode: backend ожидается запущенным отдельно (npm run start:dev)');
        return;
    }

    const backendDir = path.join(process.resourcesPath, 'backend');
    // const backendEntry = path.join(backendDir, 'dist/app/services/core/main.js');
    const backendEntry = path.join(process.resourcesPath, "backend", "server.js");


    console.log('[backend] starting from', backendEntry);

    // Настроим окружение для Nest
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env.PORT = process.env.PORT || '3000';

    // Важно: сменим рабочую директорию, как будто мы в корне backend/dist
    process.chdir(backendDir);

    // Просто require-им собранный NestJS (он поднимет HTTP-сервер)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(backendEntry);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // в dist/electron/preload.js
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDev) {
        // дев-режим
        mainWindow.loadURL('http://localhost:5173'); // поправь порт под свой фронт
        mainWindow.webContents.openDevTools();
    } else {
        // прод-режим
        // __dirname здесь: .../resources/app.asar/dist/electron
        const indexPath = path.join(
            __dirname,
            '..', // dist
            '..', // корень asar
            'frontend',
            'dist',
            'index.html'
        );

        console.log('Loading file:', indexPath);
        mainWindow.loadFile(indexPath);

        // Временная отладка, чтобы увидеть ошибки
        mainWindow.webContents.openDevTools();
        mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
            console.error('did-fail-load', { code, desc, url });
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    startBackend();
    createWindow();

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
