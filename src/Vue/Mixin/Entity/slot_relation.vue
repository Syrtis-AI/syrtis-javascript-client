<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import SlotRelationEntityManipulatorVueMixin from '../EntityManipulator/SlotRelationEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/components/_abstract/entity/entity.vue';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, SlotRelationEntityManipulatorVueMixin],
};
</script>
