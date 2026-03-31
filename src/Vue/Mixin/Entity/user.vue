<script>
import AbstractEntitySingleMixin from "@wexample/js-api/Vue/AbstractEntitySingleMixin";
import UserEntityManipulatorVueMixin from '../EntityManipulator/UserEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, UserEntityManipulatorVueMixin],
};
</script>
