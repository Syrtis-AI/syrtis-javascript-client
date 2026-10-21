<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import SlotConfigEntityManipulatorVueMixin from '../EntityManipulator/SlotConfigEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, SlotConfigEntityManipulatorVueMixin],
};
</script>
