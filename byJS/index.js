// 导入模块
const { app, BrowserWindow } = require("electron")
const path = require('path');

// 创建窗口
function createWindow() {
    let win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.loadFile("pydist/flasks/templates/login.html")
}

// // 从 python-shell 导入一个 PythonShell 对象 (注意大小写)
// const {PythonShell}  = require("python-shell")
// // PythonShell 主要有 run() 和 runString() 两个方法, 这里我们用 run()
// // run() 第一个参数是要调用的 py 文件的路径
// // 第二个参数是可选配置 (一般传 null)
// // 第三个参数是回调函数
// let options = {
//     mode: 'text',
//     pythonPath: 'xushuodb/Scripts/python'
// };
// PythonShell.run(
// 	"flasks.py", options, function (err, results) {
//         if (err) throw err
//         console.log('hello.py finished')
//         console.log('results', results)
//     }
// )

// 启动flask server，通过子进程执行已经将python项目打包好的exe文件（打包阶段）
function startServer_EXE() {
    let script = path.join(__dirname, 'pydist', 'flasks', 'flasks.exe')
    pyProc = require('child_process').execFile(script)
    if (pyProc != null) {
        console.log('flask server start success')
    }
}

function initApp() {
    startServer_EXE();
    createWindow();
}

// 停止flask server 函数
function stopServer() {
    pyProc.kill()
    console.log('kill flask server  success')
    pyProc = null
}

// 启动
app.on("ready", initApp)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    stopServer()
});