import { IProduction } from '../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../schemas/structure';
import { AngularServices, AppServices } from '../helpers/config_keys';

interface IProductionQuery extends IModelQuery { }

interface IProductionService extends IModelService<IProduction> {
	deleteItem(id: number): angular.IPromise<IRequestResult<boolean>>
	query(params: IProductionQuery): angular.IPromise<IRequestResult<Array<IProduction>>>
	details(id: number): angular.IPromise<IRequestResult<IProduction>>
}

class ProductionService implements IProductionService {

	static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

	constructor(private $q: angular.IQService,
		private $http: angular.IHttpService,
		private baseUrl: string) { }

	get() {
		let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/production`)
			.then((response: IRequestResult<Array<IProduction>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/production?id=${id}`)
			.then((response: IRequestResult<IProduction>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	query(params: IProductionQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/production/query`, params)
			.then((response: IRequestResult<Array<IProduction>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	save(production: IProduction) {
		let defer = this.$q.defer();
		if (production.id) {
			this.$http.put(`${this.baseUrl}/production`, production)
				.then((response: IRequestResult<IProduction>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/production`, production)
				.then((response: IRequestResult<IProduction>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}

	deleteItem(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/productionitem?id=${id}`)
			.then((response: IRequestResult<IProduction>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/production?id=${id}`)
			.then((response: IRequestResult<IProduction>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
		let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/production/details?id=${id}`)
			.then((response: IRequestResult<IProduction>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

}

export { ProductionService, IProductionService, IProductionQuery }