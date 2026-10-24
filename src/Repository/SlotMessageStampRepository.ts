import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import SlotMessageStamp from '../Entity/SlotMessageStamp.js';

export default class SlotMessageStampRepository extends AbstractApiRepository<SlotMessageStamp> {
  static getEntityType() {
    return SlotMessageStamp;
  }
}
