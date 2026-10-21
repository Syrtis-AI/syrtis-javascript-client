<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import CardMessageEntityManipulatorVueMixin from '../EntityManipulator/CardMessageEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, CardMessageEntityManipulatorVueMixin],
};
</script>
