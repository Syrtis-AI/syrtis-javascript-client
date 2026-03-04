<script>
import AbstractEntitySingleMixin from "@wexample/js-api/Vue/AbstractEntitySingleMixin";
import MessageStampEntityManipulatorVueMixin from '../EntityManipulator/MessageStampEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, MessageStampEntityManipulatorVueMixin],
};
</script>
