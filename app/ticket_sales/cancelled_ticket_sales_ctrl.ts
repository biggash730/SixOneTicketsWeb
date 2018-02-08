import { AngularServices, AppServices, Routes } from "../helpers/config_keys";
import { ITicketSaleService, ITicketSaleQuery } from "./ticket_sale_service";

export class CancelledTicketSalesCtrl {

    loading: boolean;
    lastFilter: any;
    records: any[];

    //Pager Config 
    totalRecords = 0;
    currentPage = 1;
    recordSize = 15;
    totalPages = 1;
    pageNumber = 1;

    static $inject = [AngularServices.State, AppServices.TicketSaleService];

    constructor(private $state: angular.ui.IStateService,
        private ticketSaleService: ITicketSaleService) {
        this.init();
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.ticketSaleService.queryCancelledTicketSales(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    };

    openForm() {
        this.$state.go(Routes.CancelledTicketSalesForm)
    }
    edit(id:number) {
        this.$state.go(Routes.CancelledTicketSalesForm, {id})
    }

    fetch(filter: any) {
        this.loading = true
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.ticketSaleService.queryCancelledTicketSales(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    init() {
        this.fetch(<any>{ pager: { page: 1, size: 15 } });
    }
}