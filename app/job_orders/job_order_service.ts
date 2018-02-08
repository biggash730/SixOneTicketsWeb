import { IJobOrder } from "../schemas/entity_set";
import { IModelService, IModelQuery, IRequestResult } from "../schemas/structure"
import { AngularServices, AppServices } from '../helpers/config_keys';

interface IJobOrderQuery extends IModelQuery {
    customerId: number
}

class JobOrderStatus {
    static get Cancelled() { return "Cancelled" }
    static get ProForma() { return "ProForma" }
    static get JobOrder() { return "JobOrder" }
    static get Production() { return "Production" }
    static get Printing() { return "Printing" }
    static get Delivered() { return "Delivered" }
}

interface IJobOrderService extends IModelService<IJobOrder> {
    query(params: IJobOrderQuery): angular.IPromise<IRequestResult<Array<IJobOrder>>>
    details(id: number): angular.IPromise<IRequestResult<IJobOrder>>
    changeStatus(id: number, status: string, printerId?: number): angular.IPromise<IRequestResult<IJobOrder>>
    confirmProforma(id: number): angular.IPromise<IRequestResult<IJobOrder>>
    generatePrint(id: number, status: string): angular.IPromise<IRequestResult<string>>
    printWithCurrency(id: number, currencyId: number): angular.IPromise<IRequestResult<string>>
    production(): angular.IPromise<IRequestResult<Array<IJobOrder>>>
    openModal(id: number, param: any): angular.ui.bootstrap.IModalServiceInstance
}

class JobOrderService implements IJobOrderService {

    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi, AngularServices.UibModal];

    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string,
        private $uibModal: angular.ui.bootstrap.IModalService) { }

    openModal(id: number, param: any) {
        var modalInstance = this.$uibModal.open({
            animation: true,
            template: require("./print.html"),
            controller: 'PrintCtrl',
            controllerAs: 'printVm',
            size: 'lg',
            resolve: { Id: () => { return id }, Param: () => { return param } }
        });
        return modalInstance;
    }

    get() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder`).then((response: IRequestResult<Array<IJobOrder>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    find(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder?id=${id}`).then((response: IRequestResult<IJobOrder>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    query(params: IJobOrderQuery) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/joborder/query`, params).then((response: IRequestResult<Array<IJobOrder>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    save(job_order: IJobOrder) {
        let defer = this.$q.defer()
        if (job_order.id) {
            this.$http.put(`${this.baseUrl}/joborder`, job_order).then((response: IRequestResult<IJobOrder>) => {
                defer.resolve(response)
            })
        } else {
            this.$http.post(`${this.baseUrl}/joborder`, job_order).then((response: IRequestResult<IJobOrder>) => {
                defer.resolve(response)
            })
        }
        return defer.promise
    }

    delete(id: number) {
        let defer = this.$q.defer()
        this.$http.delete(`${this.baseUrl}/joborder?id=${id}`).then((response: IRequestResult<IJobOrder>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    details(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/details?id=${id}`).then((response: IRequestResult<IJobOrder>) => {
            defer.resolve(response);
        });
        return defer.promise;
    }

    changeStatus(id: number, status: string, printerId: number = 0) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/changestatus?id=${id}&status=${status}&printerId=${printerId}`).then((response: IRequestResult<IJobOrder>) => {
            defer.resolve(response);
        });
        return defer.promise;
    }

    confirmProforma(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/confirm?id=${id}`).then((response: IRequestResult<IJobOrder>) => {
            defer.resolve(response);
        });
        return defer.promise;
    }

    generatePrint(id: number, status: string) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/${status.toLowerCase()}?id=${id}`).then((response: IRequestResult<string>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    printWithCurrency(id: number, currencyId: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/proforma?id=${id}&currencyId=${currencyId}`).then((response: IRequestResult<string>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    production() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/joborder/production`).then((response: IRequestResult<Array<IJobOrder>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

}

export { JobOrderService, IJobOrderService, IJobOrderQuery, JobOrderStatus }