import { AngularServices, AppServices } from "../helpers/config_keys";
import { ITicketSaleService, ITicketSaleQuery } from "./ticket_sale_service";
import { MessageBox } from "../helpers/message_box";
import { ITicketSale } from "../schemas/entity_set";

export class TicketSaleListCtrl {

    loading: boolean;
    lastFilter: ITicketSaleQuery;
    records: ITicketSale[];

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

    printTicket(id: number) {
        this.ticketSaleService.openModal(id).result.then(() => {}, () => {});
    }

    // printTicket(id: number) {
    //     this.ticketSaleService.generateTicket(id).then((res) => {
    //         if (res.success) {
    //             window.open(`data:application/pdf;base64, ${res.data}`, "_blank");
    //         } else {
    //             MessageBox.error(res.message);
    //         }
    //     });
    // }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.ticketSaleService.getSoldTickets(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    };

    fetch(filter: ITicketSaleQuery) {
        this.loading = true
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.ticketSaleService.getSoldTickets(filter).then((res) => {
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
        this.fetch(<ITicketSaleQuery>{ pager: { page: 1, size: 15 } });
    }
}