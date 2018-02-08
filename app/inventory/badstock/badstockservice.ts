import { IBadStock } from '../../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../../schemas/structure';
import { AngularServices, AppServices } from '../../helpers/config_keys';

interface IBadStockQuery extends IModelQuery {
    name: string
    phoneNumber: string
    email: string
}

interface IBadStockService extends IModelService<IBadStock> {
	query(params: IBadStockQuery): angular.IPromise<IRequestResult<Array<IBadStock>>>
	details(id: number): angular.IPromise<IRequestResult<IBadStock>>
}

class BadStockService implements IBadStockService{
    
    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

    constructor(private $q: angular.IQService,
                private $http: angular.IHttpService,
                private baseUrl: string) {}

    get() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/badstock`)
			.then((response:IRequestResult<Array<IBadStock>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

    find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/badstock?id=${id}`)
			.then((response:IRequestResult<IBadStock>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	query(params: IBadStockQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/badstock/query`, params)
			.then((response:IRequestResult<Array<IBadStock>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	save(badstock: IBadStock) {
		let defer = this.$q.defer();
		if (badstock.id) {
			this.$http.put(`${this.baseUrl}/badstock`, badstock)
				.then((response:IRequestResult<IBadStock>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/badstock`, badstock)
				.then((response:IRequestResult<IBadStock>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}
	
	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/badstock?id=${id}`)
			.then((response:IRequestResult<IBadStock>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/badstock/details?id=${id}`)
			.then((response:IRequestResult<IBadStock>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

}

export {BadStockService, IBadStockService, IBadStockQuery}