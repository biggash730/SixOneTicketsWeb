import { IStockReceipt } from '../../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../../schemas/structure';
import { AngularServices, AppServices } from '../../helpers/config_keys';

interface IStockReceiptQuery extends IModelQuery { }

interface IStockReceiptService extends IModelService<IStockReceipt> {
	deleteItem(id: number): angular.IPromise<IRequestResult<boolean>>
	query(params: IStockReceiptQuery): angular.IPromise<IRequestResult<Array<IStockReceipt>>>
	details(id: number): angular.IPromise<IRequestResult<IStockReceipt>>
}

class StockReceiptService implements IStockReceiptService {

	static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

	constructor(private $q: angular.IQService,
		private $http: angular.IHttpService,
		private baseUrl: string) { }

	get() {
		let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockreceipt`)
			.then((response: IRequestResult<Array<IStockReceipt>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/stockreceipt?id=${id}`)
			.then((response: IRequestResult<IStockReceipt>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	query(params: IStockReceiptQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/stockreceipt/query`, params)
			.then((response: IRequestResult<Array<IStockReceipt>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

	save(stockreceipt: IStockReceipt) {
		let defer = this.$q.defer();
		if (stockreceipt.id) {
			this.$http.put(`${this.baseUrl}/stockreceipt`, stockreceipt)
				.then((response: IRequestResult<IStockReceipt>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/stockreceipt`, stockreceipt)
				.then((response: IRequestResult<IStockReceipt>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}

	deleteItem(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/stockreceiptitem?id=${id}`)
			.then((response: IRequestResult<IStockReceipt>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/stockreceipt?id=${id}`)
			.then((response: IRequestResult<IStockReceipt>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
		let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/stockreceipt/details?id=${id}`)
			.then((response: IRequestResult<IStockReceipt>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}

}

export { StockReceiptService, IStockReceiptService, IStockReceiptQuery }