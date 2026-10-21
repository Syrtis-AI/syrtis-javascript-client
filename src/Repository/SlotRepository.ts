import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Slot from '../Entity/Slot.js';

export default class SlotRepository extends AbstractApiRepository<Slot> {
  static getEntityType() {
    return Slot;
  }
}

