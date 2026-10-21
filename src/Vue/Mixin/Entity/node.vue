<script>
import AbstractEntitySingleMixin from "@wexample/js-api-entity/Vue/AbstractEntitySingleMixin";
import NodeEntityManipulatorVueMixin from '../EntityManipulator/NodeEntityManipulatorVueMixin';
import Entity from '@wexample/symfony-design-system/components/_abstract/entity/entity.vue';

export default {
  extends: Entity,
  mixins: [AbstractEntitySingleMixin, NodeEntityManipulatorVueMixin],
};
</script>
