<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import MessageStampEntityManipulatorVueMixin from '../EntityManipulator/MessageStampEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/components/_abstract/entity/entity.vue';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, MessageStampEntityManipulatorVueMixin],
};
</script>
