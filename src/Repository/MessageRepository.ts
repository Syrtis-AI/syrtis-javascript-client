import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import type { ApiEntityData } from '@wexample/js-api/Common/AbstractApiEntity';
import Message from '../Entity/Message.js';

export default class MessageRepository extends AbstractApiRepository<Message> {
  static getEntityType() {
    return Message;
  }

  hydrateFromApiCollection(items: ApiEntityData[]): Message[] {
    return this.createFromApiCollection(items);
  }
}
