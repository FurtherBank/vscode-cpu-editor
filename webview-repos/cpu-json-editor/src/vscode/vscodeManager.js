"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VscodeManager = void 0;
class VscodeManager {
    /**
     * 在入口文件最先执行，获取 vscode api
     *
     * @param mockFunction 如果获取失败，执行的 mock 函数
     */
    static init(mockFunction) {
        // @ts-ignore
        if (window.acquireVsCodeApi) {
            // @ts-ignore
            this.vscode = window.acquireVsCodeApi();
            console.log('使用 vscode api');
        }
        else {
            console.log('使用 mock api');
            // mock 的场景下执行这个函数
            if (mockFunction) {
                mockFunction();
            }
        }
    }
}
exports.VscodeManager = VscodeManager;
VscodeManager.vscode = {
    postMessage(message) {
        console.log(`发送信息：${JSON.stringify(message)}`);
    },
    getState() {
        return VscodeManager.mockState;
    },
    setState(state) {
        VscodeManager.mockState = state;
    },
};
VscodeManager.mockState = '';
//# sourceMappingURL=vscodeManager.js.map