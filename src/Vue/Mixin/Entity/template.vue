<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import TemplateEntityManipulatorVueMixin from '../EntityManipulator/TemplateEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/vue/bases/entity';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, TemplateEntityManipulatorVueMixin],
};
</script>
