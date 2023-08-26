"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEditor = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
require("./index.css");
const App_1 = __importDefault(require("./App"));
const reportWebVitals_1 = __importDefault(require("./reportWebVitals"));
const vscodeManager_1 = require("./vscode/vscodeManager");
const json_schemaeditor_antd_1 = require("json-schemaeditor-antd");
vscodeManager_1.VscodeManager.init(() => {
    vscodeManager_1.VscodeManager.vscode.setState({
        data: JSON.stringify({
            "$schema": "http://json-schema.org/draft-06/schema#",
            "type": "array",
            "items": {
                "type": "string",
                "format": "row"
            },
            "definitions": {}
        }, null, 2),
        schema: json_schemaeditor_antd_1.metaSchema,
    });
});
const renderEditor = (state) => {
    const { data, schema, jsonIsSchema } = state;
    const root = client_1.default.createRoot(document.getElementById('root'));
    root.render(<react_1.default.StrictMode>
      <App_1.default data={data} schema={schema} jsonIsSchema={jsonIsSchema}/>
    </react_1.default.StrictMode>);
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    (0, reportWebVitals_1.default)();
};
exports.renderEditor = renderEditor;
function listener(event) {
    // 通过处理机制来处理
    const { data } = event;
    console.log(`收到激活信息：`, event);
    if (typeof event === 'object') {
        const { msgType, ...initState } = data;
        vscodeManager_1.VscodeManager.vscode.setState(initState);
        (0, exports.renderEditor)(data);
    }
    window.removeEventListener('message', listener);
}
const oldState = vscodeManager_1.VscodeManager.vscode.getState();
if (oldState !== undefined) {
    console.log('查询到 oldState', oldState);
    (0, exports.renderEditor)(oldState);
}
else {
    // 等监听到 data 信息再挂载组件，只执行一次
    window.addEventListener('message', listener);
}
//# sourceMappingURL=index.js.map