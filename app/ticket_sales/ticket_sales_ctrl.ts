import { AppServices, AngularServices } from "../helpers/config_keys";
import { ILookUpService } from "../settings/lookup_service";
import { ITicketSaleService } from "./ticket_sale_service";
import { MessageBox } from "../helpers/message_box";
import { ITicket, ITicketSale } from "../schemas/entity_set";

class TicketSalesCtrl {

    tickets: ITicket[];
    ticketInfo: ITicket[];
    newRecord: ITicketSale;
    memberDetails: any;

    loading: boolean;
    saving: boolean;
    verifying: boolean;

    static $inject = [AngularServices.State, AppServices.LookUpService, AppServices.TicketSaleService]

    constructor(private $state: angular.ui.IStateService,
        private lookupService: ILookUpService,
        private ticketSaleService: ITicketSaleService) {
            this.init();
        }

    printTicketxx(id: number) {
        this.ticketSaleService.generateTicket(id).then((res) => {
            if (res.success) {
                window.open(`data:application/pdf;base64, ${res.data}`, "_blank");
            } else {
                MessageBox.error(res.message);
            }
        });
    }

    verifyMember() {
        this.ticketSaleService.checkCard(this.newRecord.customerNumber).then((res) => {
            if (res.success) {
                this.memberDetails = res.data;
            } else {
                MessageBox.error("Member number does not exist");
            }
        });
    }

    calculate() {
        this.memberDetails = null;
        this.newRecord.price = this.newRecord.ticket.price * this.newRecord.quantity;
        this.newRecord.totalPrice = this.newRecord.price - this.newRecord.discount;
        this.newRecord.admission = this.newRecord.ticket.admission
    }

    save() {
        this.saving = true;
        if (!this.newRecord.ticket) {
            MessageBox.error("Please select a ticket");
            this.saving = false;
            return;
        }

        if (this.newRecord.admission > this.newRecord.ticket.admission) {
            MessageBox.error(`Number of people permitted is ${this.newRecord.ticket.admission}`);
            this.saving = false;
            return;
        }

        this.newRecord.ticketId = this.newRecord.ticket.id;
        delete this.newRecord.ticket;

        this.ticketSaleService.sellTicket(this.newRecord).then((res) => {
            this.saving = false;
            console.log(res)
            if (res.success) {
                //this.printTicket(res.data.id);
                this.newRecord = <ITicketSale>{quantity: 1, price: 0, totalPrice: 0, discount: 0};
                this.ticketSaleService.openModal(res.data.id).result.then(() => {}, () => {});
                
                //window.open(`data:application/pdf;base64, ${res.data}`, "_blank");
            }
        });
        console.log(this.newRecord)
    }
    
    private loadTickets() {
        this.loading = true;
        this.lookupService.fetch("tickets").then((res) => {
            this.loading = false;
            if (res.success) {
                this.tickets = res.data;
            }
        });
    }

    private loadTicketsByType() {
        this.loading = true;
        this.ticketSaleService.activeTickets().then((res) => {
            this.loading = false;
            if (res.success) {
                this.tickets = res.data;
            }
        });
    }

    printTicket(id: number) {
        this.ticketSaleService.openModal(id).result.then(() => {}, () => {});
    }

    private init() {
        this.loadTicketsByType();
        //this.loadTickets();
        this.newRecord = <ITicketSale>{quantity: 1, price: 0, totalPrice: 0, discount: 0}
    }
}

export { TicketSalesCtrl }