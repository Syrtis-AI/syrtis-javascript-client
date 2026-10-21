import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import SlotMessage from '../Entity/SlotMessage.js';

export default class SlotMessageRepository extends AbstractApiRepository<SlotMessage> {
  static getEntityType() {
    return SlotMessage;
  }
}

