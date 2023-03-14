import * as vscode from 'vscode';
import { PanelListeners } from '../helper/webview/IWebview';

/**
 * webview 的抽象类。
 * 
 * 所有子类实现的构造函数，必须对以下属性进行赋值：
 * - `title`
 */
export abstract class ItWebview {
    /**
     * Identifies the type of the webview panel, such as `'markdown.preview'`.
     */
    static readonly viewType: string;
  
    /**
     * webviewPanel 在 [反序列化](https://www.yuque.com/furtherbank/vscode-learn/nwooxr#LkWuX) 时执行的函数。
     * 
     * 需要通过该函数返回该 webview 实例，以实现双端状态同步。
     */
    static deserializeWebviewPanel?: (webviewPanel: vscode.WebviewPanel, state: any) => Promise<ItWebview>;

    /**
     * 在插件路径下，html 文件的目录路径。
     *
     * 实际读取该路径下的`index.html`作为 webview 内容。
     */
    static htmlPath: string;
  
    /**
     * 使用该 webview 创建 panel 时，使用的参数
     */
    static readonly getPanelOptions?: (extensionPath: string) => (vscode.WebviewPanelOptions & vscode.WebviewOptions) | undefined;
  
    /**
     * Icon for the panel shown in UI.
     */
    iconPath?: vscode.Uri | { readonly light: vscode.Uri; readonly dark: vscode.Uri };
  
    /**
     * 该函数需要可以拿到实例上下文(this)才可以。
     * 执行者为
     */
    onDidReceiveMessage?: (m: any) => void;
  
    panelListeners?: PanelListeners;

    /**
     * 
     * @param id 每个 webview 实例的专属 id，用于区分不同实例
     * @param title Title of the panel shown in UI.
     */
    constructor(public id: string = '', public title: string) {
        
    }
  }
  