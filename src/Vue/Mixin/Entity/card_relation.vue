<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import CardRelationEntityManipulatorVueMixin from '../EntityManipulator/CardRelationEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, CardRelationEntityManipulatorVueMixin],
};
</script>
