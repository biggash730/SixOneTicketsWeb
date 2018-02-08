import { IJobOrderService, IJobOrderQuery, JobOrderStatus } from "./job_order_service"
import { IJobOrder } from '../schemas/entity_set'
import { MessageBox } from '../helpers/message_box';
import { Routes, AppServices, AngularServices } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';
let _: UnderscoreStatic = require("underscore")

class JobOrdersCtrl {
    loading: boolean;
    lastFilter: IJobOrderQuery;
    records: IJobOrder[];

    //Pager Config 
    totalRecords = 0;
    currentPage = 1;
    recordSize = 15;
    totalPages = 1;
    pageNumber = 1;

    lookUps = [LookUps.Keys.Customer];
    jobOrderStatus = [JobOrderStatus.Cancelled, JobOrderStatus.ProForma, JobOrderStatus.JobOrder, JobOrderStatus.Printing, JobOrderStatus.Delivered];

    static $inject = [AngularServices.State, AppServices.JobOrderService, AppServices.LookUpService];

    constructor(private $state: angular.ui.IStateService,
        private JobOrderService: IJobOrderService,
        private lookUpService: ILookUpService) {
        this.loadLookUps()
        this.fetch(<IJobOrderQuery>{ pager: { page: 1, size: 15 } });
    }

    setStatusLabel(status: string) {
        switch (status) {
            case JobOrderStatus.ProForma:
                return "label-primary"
            case JobOrderStatus.JobOrder:
                return "label-warning"
            case JobOrderStatus.Production:
                return "label-success"
            case JobOrderStatus.Printing:
                return "label-info"
            case JobOrderStatus.Cancelled:
                return "label-danger"
            default:
                return "label-default"
        }
    }

    createOrUpdate(id: number) {
        this.$state.go(Routes.JobOrderForm, { id })
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.JobOrderService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    };

    fetch(filter: IJobOrderQuery) {
        this.loading = true
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.JobOrderService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    private loadLookUps() {
        let self: any = this;
        this.lookUps.forEach((lookup) => {
            this.lookUpService.fetch(lookup).then((res) => {
                if (res.success) { self[lookup] = res.data }
            })
        })
    }

}

export { JobOrdersCtrl }