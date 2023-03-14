import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IWebview } from '../core/helper/webview/IWebview';

export const iview: IWebview = {
  viewType: 'MyWebview',
  title: '✨MyWebview',
  getPanelOptions(extensionPath) {
    return {
      // Enable javascript in the webview
      enableScripts: true,
      // 该选项激活后，切换标签，内容不会重置
      retainContextWhenHidden: true,

      // 该字段限定可以在哪个文件夹下读取资源
      // localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'web-source/dist'))],
    };
  },
  htmlPath: 'webview-demo/build',
  onDidReceiveMessage: (message) => {
    console.log(this, message)
  }
};
