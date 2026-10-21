<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import TimezoneEntityManipulatorVueMixin from '../EntityManipulator/TimezoneEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/components/_abstract/entity/entity.vue';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, TimezoneEntityManipulatorVueMixin],
};
</script>
