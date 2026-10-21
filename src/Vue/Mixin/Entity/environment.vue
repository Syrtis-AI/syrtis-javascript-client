<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import EnvironmentEntityManipulatorVueMixin from '../EntityManipulator/EnvironmentEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, EnvironmentEntityManipulatorVueMixin],
};
</script>
