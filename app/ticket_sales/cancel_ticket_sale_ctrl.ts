import { AppServices, AngularServices, Routes } from "../helpers/config_keys";
import { ILookUpService } from "../settings/lookup_service";
import { ITicketSaleService } from "./ticket_sale_service";
import { MessageBox } from "../helpers/message_box";

class CancelTicketSaleCtrl {

    sale: any;
    cancelledSale: any;
    id: any;

    loading: boolean;
    saving: boolean;
    verifying: boolean;

    static $inject = [AngularServices.State, AppServices.LookUpService, AppServices.TicketSaleService, AngularServices.StateParams]

    constructor(private $state: angular.ui.IStateService,
        private lookupService: ILookUpService,
        private ticketSaleService: ITicketSaleService,
        private $stateParams: angular.ui.IStateParamsService) {
            this.init();
        }

    search(num: string) {
        this.ticketSaleService.getTicketSaleByReference(num).then((res) => {
            if (res.success) {
                this.sale = res.data;
            }
        });
    }

    cancel() {
        MessageBox.confirm("Cancel Ticket Sale", `Are you sure you want to cancel this sold ticket?`).then((yes) => {
            if (yes) {
                this.saving = true
                let obj = this.sale;
                obj.saleId = this.sale.id;
                this.ticketSaleService.cancelTicketSale(obj).then((res) => {
                    this.saving = false
                    if (res.success) {
                        this.$state.go(Routes.CancelledTicketSales);
                    }
                })
            }
        })
    }

    reverse() {
        MessageBox.confirm("Reverse Cancelled Ticket Sale", `Are you sure you want to reverse this cancelled sold ticket?`).then((yes) => {
            if (yes) {
                this.ticketSaleService.reverseCancelledTicketSale(this.cancelledSale.id).then((res) => {
                    if (res.success) {
                        this.$state.go(Routes.CancelledTicketSales);
                    }
                })
            }
        })
    }

    getSingle(id:number) {
        this.ticketSaleService.getCancelledTicketSale(id).then((res) => {
            if (res.success) {
                this.cancelledSale = res.data;
            }
        });
    }

    private init() {
        this.id = this.$stateParams['id']
        if (this.id) {
            this.getSingle(this.id);
        } else {
            
        }
        
    }
}

export { CancelTicketSaleCtrl }