import { ITicketSaleService } from "./ticket_sale_service";
import { MessageBox } from "../helpers/message_box";
import { AngularServices } from "../helpers/config_keys";
import { AppServices } from "../helpers/config_keys";

export class PrintTicketCtrl {

    loading: boolean;

    static $inject = [AngularServices.UibModalInstance, AppServices.TicketSaleService, "Id"];

    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, 
        private ticketSaleService: ITicketSaleService, private id: number) {
        this.start();
    }

    close() {
        this.$uibModalInstance.close("Closed");
    }

    print(id: number) {
        this.loading = true;
        this.ticketSaleService.generateTicket(id).then((res) => {
            this.loading = false;
            if (res.success) {
                setTimeout(() => {
                    this.showReport(res.data);
                }, 1000);
            } else {
                MessageBox.error(res.message);
            }
        });
    }

    private showReport(data: string) {
        let iframe = document.createElement("iframe");
        iframe.id = "pdfFrame";
        iframe.src = `data:application/pdf;base64,${data}`;
        $("#rptFrame").append(iframe);
    }

    private start() {
        if (this.id) this.print(this.id);
        // else this.printTags();
    }
}