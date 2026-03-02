import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import Message from '../Entity/Message.js';

export default class MessageRepository extends AbstractApiRepository<Message> {
  static getEntityType() {
    return Message;
  }

  hydrateFromApiCollection(
    items: Parameters<AbstractApiRepository<Message>['createFromApiCollection']>[0]
  ): Message[] {
    return this.createFromApiCollection(items);
  }
}
