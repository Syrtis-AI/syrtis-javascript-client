import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import SlotConfig from '../Entity/SlotConfig.js';

export default class SlotConfigRepository extends AbstractApiRepository<SlotConfig> {
  static getEntityType() {
    return SlotConfig;
  }
}

