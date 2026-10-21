import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import CardRelation from '../Entity/CardRelation.js';

export default class CardRelationRepository extends AbstractApiRepository<CardRelation> {
  static getEntityType() {
    return CardRelation;
  }
}

