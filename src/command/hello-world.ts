import * as vscode from 'vscode';
import Command from '../core/command/command';

export default class HelloWorld extends Command {
  static execute(args: any) {
	  vscode.window.showInformationMessage('Hello World from cpu-ext-trial!');
  }
}