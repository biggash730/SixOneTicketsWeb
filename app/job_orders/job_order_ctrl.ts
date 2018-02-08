import { AngularServices, AppServices, Routes } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { IJobOrderService, JobOrderStatus } from './job_order_service';
import { IJobOrder } from '../schemas/entity_set';
import { MessageBox, MessageTypes, Toast } from '../helpers/message_box';

class JobOrderCtrl {
    image: any
    jobOrderDetails: IJobOrder;
    confirming: boolean;
    loading: boolean;
    priceAlertMsg: string

    lookUps = [LookUps.Keys.Currency, LookUps.Keys.Printers]
    static $inject = [AngularServices.State, AngularServices.StateParams, AppServices.LookUpService, AppServices.JobOrderService];

    constructor(private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private lookUpService: ILookUpService,
        private jobOrderService: IJobOrderService) {
        this.start();
    }

    sendEmail() {
        console.log("Send email");

    }

    print(id: number, param: any) {
        this.jobOrderService.openModal(id, param).result.then(() => {}, () => {});
    }

    confirmProforma() {
        MessageBox.confirm("Confirm Proforma", `Confirming this Proforma will change its status to Job Order. Are you sure you want to continue`, MessageTypes.SUCCESS).then((yes) => {
            if (yes) {
                this.confirming = true
                this.jobOrderService.confirmProforma(this.jobOrderDetails.id).then((res) => {
                    this.confirming = false
                    if (res.success) { this.$state.reload() }
                })
            }
        })
    }

    cancelOrder() {
        MessageBox.confirm("Cancel Order", `Are you sure you want to cancel this order?`).then((yes) => {
            if (yes) {
                this.confirming = true
                this.jobOrderService.changeStatus(this.jobOrderDetails.id, JobOrderStatus.Cancelled).then((res) => {
                    this.confirming = false
                    if (res.success) { this.$state.reload() }
                })
            }
        })
    }

    startProcess(process: string, printerId: number) {
        let title = (process != JobOrderStatus.Delivered) ? `Start ${process}` : process
        MessageBox.confirm(title, `Are you sure you want to start ${process.toLowerCase()}?`, MessageTypes.SUCCESS).then((yes) => {
            if (yes) {
                this.confirming = true
                this.jobOrderService.changeStatus(this.jobOrderDetails.id, process, printerId).then((res) => {
                    this.confirming = false
                    if (res.success) { this.$state.reload() }
                })
            }
        })
    }

    view(id: number) {
        id = this.$stateParams['id']
        this.$state.go(Routes.JobOrderForm, { id })
    }

    closeForm() {
        this.$state.go(Routes.JobOrders);
    }

    private getDetails(id: number) {
        this.loading = true;
        this.jobOrderService.details(id).then((res => {
            this.loading = false;
            if (res.success) {
                this.jobOrderDetails = res.data;
                this.jobOrderDetails.items.forEach((item) => {
                    if (item.unitPrice != item.price) {
                        this.priceAlertMsg = `The price for ${item.product} has changed. Please go to Edit and click Save to apply the new price.`
                    }
                })
            }
        }));
    }

    private loadLookUps() {
        let self: any = this;
        this.lookUps.forEach((lookup) => {
            this.lookUpService.fetch(lookup).then((res) => {
                if (res.success) { self[lookup] = res.data }
            })
        })
    }

    private start() {
        let id = this.$stateParams['id']
        if (id) {
            this.getDetails(id);
            this.loadLookUps();
        }
    }
}

export { JobOrderCtrl }