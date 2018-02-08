import { IStockItem } from '../../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../../schemas/structure';
import { AngularServices, AppServices } from '../../helpers/config_keys';

interface IStockItemQuery extends IModelQuery {
    
}

interface IStockItemService extends IModelService<IStockItem> {
	query(params: IStockItemQuery): angular.IPromise<IRequestResult<Array<IStockItem>>>
	details(id: number): angular.IPromise<IRequestResult<IStockItem>>
	availableStock(): angular.IPromise<IRequestResult<Array<IStockItem>>>
	allDetails(): angular.IPromise<IRequestResult<Array<IStockItem>>>
}

class StockItemService implements IStockItemService{
    
    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

    constructor(private $q: angular.IQService,
                private $http: angular.IHttpService,
                private baseUrl: string) {}

    get() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockitem`)
			.then((response:IRequestResult<Array<IStockItem>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

    find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/stockitem?id=${id}`)
			.then((response:IRequestResult<IStockItem>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	query(params: IStockItemQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/stockitem/query`, params)
			.then((response:IRequestResult<Array<IStockItem>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	save(stockitem: IStockItem) {
		let defer = this.$q.defer();
		if (stockitem.id) {
			this.$http.put(`${this.baseUrl}/stockitem`, stockitem)
				.then((response:IRequestResult<IStockItem>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/stockitem`, stockitem)
				.then((response:IRequestResult<IStockItem>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}
	
	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/stockitem?id=${id}`)
			.then((response:IRequestResult<IStockItem>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockitem/details?id=${id}`)
			.then((response:IRequestResult<IStockItem>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

	availableStock() {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/stockitem/availablestock`)
			.then((response: IRequestResult<Array<IStockItem>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	allDetails() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockitem/alldetails`)
			.then((response:IRequestResult<Array<IStockItem>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

}

export {StockItemService, IStockItemService, IStockItemQuery}