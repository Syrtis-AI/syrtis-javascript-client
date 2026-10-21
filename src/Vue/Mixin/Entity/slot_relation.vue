<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import SlotRelationEntityManipulatorVueMixin from '../EntityManipulator/SlotRelationEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, SlotRelationEntityManipulatorVueMixin],
};
</script>
