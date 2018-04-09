const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const commonConfig = require('../package');
//调试模式
let openDebug;
//应用名称
let appName = commonConfig.name;
//主页面
let mainWindow;

//是否开发调试模式,开发模式下加载配置
const isDev = process.env.NODE_ENV === 'development'
let devConfig

if (isDev) {
    devConfig = require('../build/config');
    openDebug = true;
} else {
    devConfig = {}
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        minHeight: 400,
        minWidth: 300,
        frame: false
        // resizable: false
    });
    const url = isDev ? `http://127.0.0.1:${devConfig.port}/main.html` : `file://${__dirname}/dist/main.html`
    mainWindow.loadURL(url)
    if (openDebug) {
        mainWindow.webContents.openDevTools()
    };
    if (isDev) {
        const installExtension = require('electron-devtools-installer')
        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(err => console.log('An error occurred: ', err))
    }
    mainWindow.on('closed', () => {
        mainWindow = null
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
    /**
     * 创建右键菜单
     **/
    let template = [{
            label: '复制',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: '粘贴',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            type: 'separator'
        },
        // {
        //     label: '撤销',
        //     accelerator: 'CmdOrCtrl+Z',
        //     role: 'undo'
        // }, {
        //     label: '重做',
        //     accelerator: 'Shift+CmdOrCtrl+Z',
        //     role: 'redo'
        // },
        {
            label: '剪切',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: '全选',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    mainWindow.webContents.on('context-menu', function(e, params) {
        menu.popup(mainWindow, params.x, params.y)
    })
}


app.on('ready', createMainWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('exit', (event, arg) => {
    app.quit();
})

ipcMain.on('shrink', (event, arg) => {
    mainWindow.minimize();
})

ipcMain.on('full', (event, arg) => {
    if (mainWindow.isMaximized()) {
        event.sender.send('isfill-reply', '0');
        mainWindow.unmaximize();
    } else {
        event.sender.send('isfill-reply', '1');
        mainWindow.maximize();
    }
})

ipcMain.on('resize', (event, arg) => {
    mainWindow.setContentSize(780, 500);
    mainWindow.setMinimumSize(780, 500);
    mainWindow.center();
    mainWindow.setResizable(true);
})