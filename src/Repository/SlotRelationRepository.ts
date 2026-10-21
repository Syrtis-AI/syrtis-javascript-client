import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import SlotRelation from '../Entity/SlotRelation.js';

export default class SlotRelationRepository extends AbstractApiRepository<SlotRelation> {
  static getEntityType() {
    return SlotRelation;
  }
}

