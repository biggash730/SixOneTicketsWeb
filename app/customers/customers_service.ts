import { ICustomer } from '../schemas/entity_set';
import { IModelService, IRequestResult, IModelQuery } from '../schemas/structure';
import { AngularServices, AppServices } from '../helpers/config_keys';

interface ICustomerQuery extends IModelQuery {
    name: string
    phoneNumber: string
    email: string
}

interface ICustomerService extends IModelService<ICustomer> {
	query(params: ICustomerQuery): angular.IPromise<IRequestResult<Array<ICustomer>>>
	details(id: number): angular.IPromise<IRequestResult<ICustomer>>
	deleteContact(id: number): angular.IPromise<IRequestResult<boolean>>
}

class CustomerService implements ICustomerService{
    
    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

    constructor(private $q: angular.IQService,
                private $http: angular.IHttpService,
                private baseUrl: string) {}

    get() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/customer`)
			.then((response:IRequestResult<Array<ICustomer>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

    find(id: number) {
		let defer = this.$q.defer();
		this.$http.get(`${this.baseUrl}/customer?id=${id}`)
			.then((response:IRequestResult<ICustomer>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	query(params: ICustomerQuery) {
		let defer = this.$q.defer();
		this.$http.post(`${this.baseUrl}/customer/query`, params)
			.then((response:IRequestResult<Array<ICustomer>>) => {
				defer.resolve(response);
			});
		return defer.promise;
	}
	
	save(customer: ICustomer) {
		let defer = this.$q.defer();
		if (customer.id) {
			this.$http.put(`${this.baseUrl}/customer`, customer)
				.then((response:IRequestResult<ICustomer>) => {
					defer.resolve(response);
				});
		} else {
			this.$http.post(`${this.baseUrl}/customer`, customer)
				.then((response:IRequestResult<ICustomer>) => {
					defer.resolve(response);
				});
		}
		return defer.promise;
	}
	
	delete(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/customer?id=${id}`)
			.then((response:IRequestResult<ICustomer>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

	details(id: number) {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/customer/details?id=${id}`)
			.then((response:IRequestResult<ICustomer>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

	deleteContact(id: number) {
		let defer = this.$q.defer();
		this.$http.delete(`${this.baseUrl}/contact?id=${id}`)
			.then((response:IRequestResult<boolean>) => {
				defer.resolve(response);
			});
		return defer.promise
	}

}

export {CustomerService, ICustomerService, ICustomerQuery}