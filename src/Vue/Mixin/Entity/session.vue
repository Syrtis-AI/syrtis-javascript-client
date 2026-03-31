<script>
import AbstractEntitySingleMixin from "@wexample/js-api/Vue/AbstractEntitySingleMixin";
import SessionEntityManipulatorVueMixin from '../EntityManipulator/SessionEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, SessionEntityManipulatorVueMixin],
};
</script>
