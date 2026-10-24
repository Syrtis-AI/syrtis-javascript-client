import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Job from '../Entity/Job.js';

export default class JobRepository extends AbstractApiRepository<Job> {
  static getEntityType() {
    return Job;
  }
}
