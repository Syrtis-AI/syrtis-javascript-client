<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import {{CLASS_NAME}}EntityManipulatorVueMixin from '../EntityManipulator/{{CLASS_NAME}}EntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, {{CLASS_NAME}}EntityManipulatorVueMixin],
};
</script>
