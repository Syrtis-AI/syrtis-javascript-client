<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import ScenarioEntityManipulatorVueMixin from '../EntityManipulator/ScenarioEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, ScenarioEntityManipulatorVueMixin],
};
</script>
