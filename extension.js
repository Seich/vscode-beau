const vscode = require('vscode');
const BeauPanel = require('./src/beauPanel.js');

function activate(context) {
  let beauPanel = new BeauPanel();

  let disposable = vscode.commands.registerCommand(
    'beau.newRequest',
    function() {
      beauPanel.show();
    }
  );

  context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
