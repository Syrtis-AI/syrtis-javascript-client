import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Template from '../Entity/Template.js';

export default class TemplateRepository extends AbstractApiRepository<Template> {
  static getEntityType() {
    return Template;
  }
}
