import { IStockIssue } from '../../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../../schemas/structure';
import { AngularServices, AppServices } from '../../helpers/config_keys';

interface IStockIssueQuery extends IModelQuery {
    
}

interface IStockIssueService extends IModelService<IStockIssue> {
	deleteItem(id: number): angular.IPromise<IRequestResult<boolean>>
	query(params: IStockIssueQuery): angular.IPromise<IRequestResult<Array<IStockIssue>>>
	details(id: number): angular.IPromise<IRequestResult<IStockIssue>>
}

class StockIssueService implements IStockIssueService{
    
    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

    constructor(private $q: angular.IQService,
                private $http: angular.IHttpService,
                private baseUrl: string) {}

    get() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockissue`)
			.then((response:IRequestResult<Array<IStockIssue>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

    find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/stockissue?id=${id}`)
			.then((response:IRequestResult<IStockIssue>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	query(params: IStockIssueQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/stockissue/query`, params)
			.then((response:IRequestResult<Array<IStockIssue>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	save(stockissue: IStockIssue) {
		let defer = this.$q.defer();
		if (stockissue.id) {
			this.$http.put(`${this.baseUrl}/stockissue`, stockissue)
				.then((response:IRequestResult<IStockIssue>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/stockissue`, stockissue)
				.then((response:IRequestResult<IStockIssue>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}

	deleteItem(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/stockrissueitem?id=${id}`)
			.then((response: IRequestResult<IStockIssue>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	
	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/stockissue?id=${id}`)
			.then((response:IRequestResult<IStockIssue>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockissue/details?id=${id}`)
			.then((response:IRequestResult<IStockIssue>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

}

export {StockIssueService, IStockIssueService, IStockIssueQuery}