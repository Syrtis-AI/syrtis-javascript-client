<script>
import AbstractEntitySingleMixin from "@wexample/js-api/Vue/AbstractEntitySingleMixin";
import RequestEntityManipulatorVueMixin from '../EntityManipulator/RequestEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, RequestEntityManipulatorVueMixin],
};
</script>
