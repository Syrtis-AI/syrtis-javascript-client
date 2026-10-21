<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import CardRelationEntityManipulatorVueMixin from '../EntityManipulator/CardRelationEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/components/_abstract/entity/entity.vue';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, CardRelationEntityManipulatorVueMixin],
};
</script>
