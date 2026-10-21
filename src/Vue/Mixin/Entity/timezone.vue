<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import TimezoneEntityManipulatorVueMixin from '../EntityManipulator/TimezoneEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, TimezoneEntityManipulatorVueMixin],
};
</script>
