import { ISupplier } from "../schemas/entity_set";
import { IModelService, IModelQuery, IRequestResult } from "../schemas/structure"
import { PartialViews } from '../helpers/config_keys';
import { AngularServices, AppServices } from '../helpers/config_keys';

interface ISupplierQuery extends IModelQuery { }

interface ISupplierService extends IModelService<ISupplier> {
    query(params: ISupplierQuery): angular.IPromise<IRequestResult<Array<ISupplier>>>
}

class SupplierService implements ISupplierService {

    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi, AngularServices.UibModal];

    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string,
        private $uibModal: angular.ui.bootstrap.IModalService) { }

    get() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/supplier`).then((response: IRequestResult<Array<ISupplier>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    find(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/supplier?id=${id}`).then((response: IRequestResult<ISupplier>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    query(params: ISupplierQuery) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/supplier/query`, params).then((response: IRequestResult<Array<ISupplier>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    save(supplier: ISupplier) {
        let defer = this.$q.defer()
        if (supplier.id) {
            this.$http.put(`${this.baseUrl}/supplier`, supplier).then((response: IRequestResult<ISupplier>) => {
                defer.resolve(response)
            })
        } else {
            this.$http.post(`${this.baseUrl}/supplier`, supplier).then((response: IRequestResult<ISupplier>) => {
                defer.resolve(response)
            })
        }
        return defer.promise
    }

    delete(id: number) {
        let defer = this.$q.defer()
        this.$http.delete(`${this.baseUrl}/supplier?id=${id}`).then((response: IRequestResult<ISupplier>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

}

export { SupplierService, ISupplierService, ISupplierQuery }