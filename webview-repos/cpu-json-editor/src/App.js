"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./App.css");
require("antd/dist/antd.compact.css");
const json_schemaeditor_antd_1 = __importStar(require("json-schemaeditor-antd"));
const antd_1 = require("antd");
const vscodeManager_1 = require("./vscode/vscodeManager");
const icons_1 = require("@ant-design/icons");
const lodash_1 = require("lodash");
function App(props) {
    const { data: initialData, schema: initialSchema, jsonIsSchema } = props;
    const initialJson = (0, react_1.useMemo)(() => {
        try {
            const json = JSON.parse(initialData ?? 'null');
            return json;
        }
        catch (error) {
            console.log('initial data 解析错误', initialData);
            return undefined;
        }
    }, []);
    const dataStringRef = (0, react_1.useRef)(initialData);
    const [dataJson, setDataJson] = (0, react_1.useState)(initialJson ?? null);
    const [schema, setSchema] = (0, react_1.useState)(initialSchema);
    const [jsonChanged, setJsonChanged] = (0, react_1.useState)(false);
    const [isError, setIsError] = (0, react_1.useState)(initialJson === undefined);
    // 如果用 ref 包住 datastring，可以避免来回挂载
    (0, react_1.useEffect)(() => {
        const handler = (e) => {
            const { data, msgType, schema } = e.data;
            if (!msgType)
                return; // dev 时会受到一个错误的 message 事件，将其过滤
            const state = vscodeManager_1.VscodeManager.vscode.getState() ?? {};
            // 1. 处理收到的 data
            if (data !== undefined) {
                if (data !== dataStringRef.current) {
                    console.log('检测到外部 json 变化，重新解析……', data === dataStringRef.current, data.localeCompare(dataStringRef.current) === 0, data.trim() === dataStringRef.current);
                    console.log(data);
                    console.log(dataStringRef.current);
                    dataStringRef.current = data;
                    setJsonChanged(false);
                    try {
                        const json = JSON.parse(data);
                        setDataJson(json);
                        setIsError(false);
                        vscodeManager_1.VscodeManager.vscode.setState({
                            ...state,
                            data: data,
                        });
                    }
                    catch (error) {
                        console.log(`json 解析错误`, error, data);
                        setDataJson(null);
                        setIsError(true);
                        vscodeManager_1.VscodeManager.vscode.setState({
                            ...state,
                            data: undefined,
                        });
                    }
                }
            }
            // 2. 处理收到的 schema
            if (schema !== undefined) {
                // vscode schema 同步消息是防抖的，所以不需要做额外处理
                setSchema(schema);
                vscodeManager_1.VscodeManager.vscode.setState({
                    ...state,
                    schema: schema,
                });
            }
            // 3. 对于信息的类型放对应对话框消息
            switch (msgType) {
                default:
                    break;
            }
        };
        window.addEventListener('message', handler);
        return () => {
            window.removeEventListener('message', handler);
        };
    }, [dataStringRef]);
    // 0.6s 一次向 vscode 发送新的 jsonString
    const syncJson = (0, react_1.useCallback)((0, lodash_1.debounce)((newJson) => {
        // 1. 获得新的 json 字符串，并发送到 vscode 端
        const newString = JSON.stringify(newJson, null, 2);
        dataStringRef.current = newString;
        setJsonChanged(false);
        vscodeManager_1.VscodeManager.vscode.postMessage(newString);
        // 2. 将新的 json 同步到 webview state
        const state = vscodeManager_1.VscodeManager.vscode.getState() ?? {};
        vscodeManager_1.VscodeManager.vscode.setState({
            ...state,
            data: newString,
        });
    }, 600), []);
    const handleChange = (0, react_1.useCallback)((value) => {
        console.log('来自于 editor 的变化');
        setDataJson(value);
        setJsonChanged(true);
        syncJson(value);
    }, [setDataJson]);
    const syncSchemaHandler = (0, react_1.useCallback)(() => {
        vscodeManager_1.VscodeManager.vscode.postMessage({
            msgType: 'sync-schema',
        });
    }, []);
    const resetSchemaHandler = (0, react_1.useCallback)(() => {
        vscodeManager_1.VscodeManager.vscode.postMessage({
            msgType: 'reset-schema',
        });
    }, []);
    const extraButtons = jsonIsSchema
        ? []
        : schema !== undefined
            ? [
                <antd_1.Button key="1" type="primary" icon={<icons_1.FileSyncOutlined />} onClick={syncSchemaHandler}>
          同步 schema
        </antd_1.Button>,
                <antd_1.Button key="2" danger icon={<icons_1.FileSyncOutlined />} onClick={resetSchemaHandler}>
          重置 schema
        </antd_1.Button>,
            ]
            : [
                <antd_1.Button key="1" type="primary" icon={<icons_1.FileSyncOutlined />} onClick={resetSchemaHandler}>
          生成 schema
        </antd_1.Button>,
            ];
    return (<div>
      <antd_1.PageHeader title="JSON Editor" className="site-page-header" subTitle="By FurtherBank" extra={extraButtons}></antd_1.PageHeader>
      {isError ? <antd_1.Alert message={'文件无法解析为 json，请通过默认编辑器修改后再试。'}/> : null}
      <json_schemaeditor_antd_1.default data={dataJson} schema={jsonIsSchema ? json_schemaeditor_antd_1.metaSchema : schema} onChange={handleChange}/>
    </div>);
}
exports.default = App;
//# sourceMappingURL=App.js.map