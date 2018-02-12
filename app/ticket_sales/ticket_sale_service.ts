import { IModelService, IModelQuery, IRequestResult } from "../schemas/structure";
import { AngularServices, AppServices } from "../helpers/config_keys";
import { ITicketSale, ITicket } from "../schemas/entity_set";

interface ITicketSaleQuery extends IModelQuery{

}

interface ITicketSaleService extends IModelService<ITicketSale> {
    query(params: ITicketSaleQuery): angular.IPromise<IRequestResult<Array<ITicketSale>>>
    details(id: number): angular.IPromise<IRequestResult<ITicketSale>>
    activeTickets(): angular.IPromise<IRequestResult<Array<ITicket>>>
    sellTicket(ticketSale: ITicketSale): angular.IPromise<IRequestResult<ITicketSale>>
    checkCard(number: string): angular.IPromise<IRequestResult<any>>
    getSoldTickets(params: ITicketSaleQuery): angular.IPromise<IRequestResult<Array<ITicketSale>>>
    generateTicket(id: number): angular.IPromise<IRequestResult<string>>
    cancelTicketSale(obj: any): angular.IPromise<IRequestResult<any>>
    queryCancelledTicketSales(params: any): angular.IPromise<IRequestResult<Array<any>>>
    getCancelledTicketSale(id: number): angular.IPromise<IRequestResult<any>>
    reverseCancelledTicketSale(id: number): angular.IPromise<IRequestResult<any>>
    getTicketSaleByReference(num: string): angular.IPromise<IRequestResult<any>>
    openModal(id: number): angular.ui.bootstrap.IModalServiceInstance
}

class TicketSaleService implements IModelService<ITicketSale> {

    static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi, AngularServices.UibModal];

    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string,
        private $uibModal: angular.ui.bootstrap.IModalService) { }

        openModal(id: number) {
            var modalInstance = this.$uibModal.open({
                animation: true,
                template: require("../reports/print.html"),
                controller: 'PrintTicketCtrl',
                controllerAs: 'printVm',
                // size: 'lg',
                resolve: { Id: () => { return id } }
            });
            return modalInstance;
        }

    get() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets`).then((response: IRequestResult<Array<ITicket>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    find(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets?id=${id}`).then((response: IRequestResult<ITicketSale>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    query(params: ITicketSaleQuery) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/tickets/query`, params).then((response: IRequestResult<Array<ITicketSale>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    save(ticketSale: ITicketSale) {
        let defer = this.$q.defer()
        if (ticketSale.id) {
            this.$http.put(`${this.baseUrl}/tickets`, ticketSale).then((response: IRequestResult<ITicketSale>) => {
                defer.resolve(response)
            })
        } else {
            this.$http.post(`${this.baseUrl}/tickets`, ticketSale).then((response: IRequestResult<ITicketSale>) => {
                defer.resolve(response)
            })
        }
        return defer.promise
    }

    delete(id: number) {
        let defer = this.$q.defer()
        this.$http.delete(`${this.baseUrl}/tickets?id=${id}`).then((response: IRequestResult<ITicketSale>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    details(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets/details?id=${id}`)
            .then((response: IRequestResult<ITicketSale>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    activeTickets() {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets/getactivetickets`)
            .then((response: IRequestResult<Array<ITicket>>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    sellTicket(ticketSale: ITicketSale) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/tickets/sellticket`, ticketSale)
            .then((response: IRequestResult<ITicketSale>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    checkCard(number: string) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/customers/checkcustomercard?cardNumber=${number}`)
            .then((response: IRequestResult<any>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    getSoldTickets(params: ITicketSaleQuery) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/tickets/getpersonalticketsales`, params).then((response: IRequestResult<Array<ITicketSale>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    cancelTicketSale(obj: any) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/tickets/cancelticketsale`,obj)
            .then((response: IRequestResult<any>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    queryCancelledTicketSales(params: any) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/cancelledticketsales/query`, params).then((response: IRequestResult<Array<any>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    getCancelledTicketSale(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/cancelledticketsales?id=${id}`)
            .then((response: IRequestResult<any>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }
    reverseCancelledTicketSale(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/cancelledticketsales/reverse?id=${id}`)
            .then((response: IRequestResult<any>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }
    getTicketSaleByReference(num: string) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets/getticketsalebyreference?refNumber=${num}`)
            .then((response: IRequestResult<any>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }

    generateTicket(id: number) {
        let defer = this.$q.defer()
        this.$http.get(`${this.baseUrl}/tickets/printsale?id=${id}`)
            .then((response: IRequestResult<string>) => {
                defer.resolve(response);
            });
        return defer.promise;
    }
}

export { TicketSaleService, ITicketSaleService, ITicketSaleQuery }