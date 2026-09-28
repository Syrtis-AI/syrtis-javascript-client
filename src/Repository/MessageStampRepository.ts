import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import MessageStamp from '../Entity/MessageStamp.js';

export default class MessageStampRepository extends AbstractApiRepository<MessageStamp> {
  static getEntityType() {
    return MessageStamp;
  }
}
