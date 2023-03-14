import * as vscode from 'vscode';
import Command from '../core/command/command';

export default class LogFile extends Command {
  static async execute(args: vscode.Uri) {
	  const document = await vscode.workspace.openTextDocument(args);
    const data = document.getText();
    vscode.window.showInformationMessage(data)
  }
}