import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('multiple-database-search-bar', 'Integration | Component | multiple database search bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{multiple-database-search-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#multiple-database-search-bar}}
      template block text
    {{/multiple-database-search-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
