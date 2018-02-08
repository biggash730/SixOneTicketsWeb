import { IProduct, ICustomerProducts } from "../schemas/entity_set";
import { IModelService, IModelQuery, IRequestResult } from "../schemas/structure"
import { AngularServices, AppServices } from '../helpers/config_keys';

interface IProductQuery extends IModelQuery {

}

interface IProductService extends IModelService<IProduct> {
    query(params: IProductQuery): angular.IPromise<IRequestResult<Array<IProduct>>>
    details(id: number): angular.IPromise<IRequestResult<IProduct>>
    customerProducts(): angular.IPromise<IRequestResult<Array<ICustomerProducts>>>
}

class ProductService implements IProductService {

    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi];

    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string,
        private $uibModal: angular.ui.bootstrap.IModalService) { }

    get() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/product`).then((response: IRequestResult<Array<IProduct>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    find(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/product?id=${id}`).then((response: IRequestResult<IProduct>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    query(params: IProductQuery) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/product/query`, params).then((response: IRequestResult<Array<IProduct>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    save(product: IProduct) {
        let defer = this.$q.defer()
        if (product.id) {
            this.$http.put(`${this.baseUrl}/product`, product).then((response: IRequestResult<IProduct>) => {
                defer.resolve(response)
            })
        } else {
            this.$http.post(`${this.baseUrl}/product`, product).then((response: IRequestResult<IProduct>) => {
                defer.resolve(response)
            })
        }
        return defer.promise
    }

    delete(id: number) {
        let defer = this.$q.defer()
        this.$http.delete(`${this.baseUrl}/product?id=${id}`).then((response: IRequestResult<IProduct>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    details(id: number) {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/product/details?id=${id}`)
			.then((response:IRequestResult<IProduct>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

    customerProducts() {
        let defer = this.$q.defer()
		this.$http.get(`${this.baseUrl}/product/customerproducts`)
			.then((response: IRequestResult<Array<ICustomerProducts>>) => {
				defer.resolve(response);
			});
		return defer.promise;
    }

}

export { ProductService, IProductService, IProductQuery }