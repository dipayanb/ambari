import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-advanced-settings', 'Integration | Component | table advanced settings', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{table-advanced-settings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#table-advanced-settings}}
      template block text
    {{/table-advanced-settings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
