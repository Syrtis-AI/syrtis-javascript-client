import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import CardMessage from '../Entity/CardMessage.js';

export default class CardMessageRepository extends AbstractApiRepository<CardMessage> {
  static getEntityType() {
    return CardMessage;
  }
}
