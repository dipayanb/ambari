import Ember from 'ember';

export default Ember.Component.extend({

  tagName: "query-editor",

  _initializeEditor: function() {

    var editor,
      updateSize,
      self = this;

    updateSize = function () {
      editor.setSize(self.$(this).width(), self.$(this).height());
      editor.refresh();
    };

    this.set('editor', CodeMirror.fromTextArea(document.getElementById('code-mirror'), {
      mode: 'text/x-hive',
      hint: CodeMirror.hint.sql,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets : true,
      autofocus: true,
      extraKeys: {'Ctrl-Space': 'autocomplete'}
    }));


    CodeMirror.commands.autocomplete = function (cm) {
      var lastWord = cm.getValue().split(' ').pop();

      //if user wants to fill in a column
      if (lastWord.indexOf('.') > -1) {
        lastWord = lastWord.split('.')[0];

        self.getColumnsHint(cm, lastWord);
      } else {
        CodeMirror.showHint(cm);
      }
    };

    editor = this.get('editor');

    editor.on('cursorActivity', function () {
      self.set('highlightedText', editor.getSelections());
    });

    editor.setValue(this.get('query') || '');

    editor.on('change', function (instance) {
      Ember.run(function () {
        self.set('query', instance.getValue());
      });
    });




  }.on('didInsertElement'),


  updateValue: function () {
    var query = this.get('query');
    var editor = this.get('editor');

    var isFinalExplainQuery = (query.toUpperCase().trim().indexOf('EXPLAIN') > -1);
    var editorQuery = editor.getValue();

    if (editor.getValue() !== query) {
      if(isFinalExplainQuery){
        editor.setValue(editorQuery || '')
      }else {
        editor.setValue(query || '');
      }
    }

  }.observes('query'),


  actions:{
  }

});
