import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Card from '../Entity/Card.js';

export default class CardRepository extends AbstractApiRepository<Card> {
  static getEntityType() {
    return Card;
  }
}

