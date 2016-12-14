import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hdfs-viewer-modal', 'Integration | Component | hdfs viewer modal', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hdfs-viewer-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#hdfs-viewer-modal}}
      template block text
    {{/hdfs-viewer-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
