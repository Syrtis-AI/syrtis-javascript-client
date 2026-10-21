<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import DocumentEntityManipulatorVueMixin from '../EntityManipulator/DocumentEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, DocumentEntityManipulatorVueMixin],
};
</script>
