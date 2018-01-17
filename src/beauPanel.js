const Beau = require('beau');
const yaml = require('js-yaml');
const vscode = require('vscode');
const HTTP = require('http-status');
const { window, ProgressLocation } = vscode;

class BeauPanel {
  show() {
    let editor = window.activeTextEditor;

    if (!editor) {
      return;
    }

    let text = editor.document.getText();
    let doc = yaml.safeLoad(text);
    let beau = new Beau(doc);

    let aliases = beau.requests.list.map(r => ({
      label: r.ALIAS,
      description: r.ENDPOINT,
      verb: r.VERB
    }));

    window.showQuickPick(aliases).then(request => {
      let alias = request.label;
      let task = () => beau.requests.execByAlias(alias);

      window
        .withProgress(
          {
            title: `Requesting: ${alias}`,
            location: ProgressLocation.Window
          },
          task
        )
        .then(response => {
          let channel = window.createOutputChannel('test');

          channel.appendLine(`${request.verb} ${response.request.endpoint}`);
          channel.appendLine(
            `${response.response.status} ${HTTP[response.response.status]}`
          );

          channel.appendLine('');
          channel.appendLine(`Response Headers: `);
          channel.appendLine(
            JSON.stringify(response.response.headers, null, 4)
          );

          channel.appendLine('');
          channel.appendLine(`Response Body: `);
          channel.appendLine(JSON.stringify(response.body, null, 4));

          channel.show();
        })
        .catch(e => console.error(e));
    });
  }
}

module.exports = BeauPanel;
