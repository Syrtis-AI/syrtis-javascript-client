<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import JobEntityManipulatorVueMixin from '../EntityManipulator/JobEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, JobEntityManipulatorVueMixin],
};
</script>
