import { MessageBox } from "../helpers/message_box";
import { AngularServices, AppServices } from "../helpers/config_keys";
import { IJobOrderService, JobOrderStatus } from "./job_order_service";

export class PrintCtrl {

    loading: boolean;

    static $inject = [AngularServices.UibModalInstance, AppServices.JobOrderService, "Id", "Param"];

    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private jobOrderService: IJobOrderService,
        private id: number,
        private param: any) {
        this.start();
    }

    close() {
        this.$uibModalInstance.close("Closed");
    }

    printJobOrder(id: number, status: string) {
        this.loading = true;
        this.jobOrderService.generatePrint(id, status).then((res) => {
            this.loading = false;
            if (res.success) {
                setTimeout(() => {
                    this.showReport(res.data);
                }, 500);
            } else {
                MessageBox.error(res.message);
            }
        })
    }

    printProforma(id: number, currencyId: number) {
        this.loading = true;
        this.jobOrderService.printWithCurrency(id, currencyId).then((res) => {
            this.loading = false;
            if (res.success) {
                setTimeout(() => {
                    this.showReport(res.data);
                }, 500);
            } else {
                MessageBox.error(res.message);
            }
        })
    }

    private showReport(data: string) {
        let iframe = document.createElement("iframe");
        iframe.id = "pdfFrame";
        iframe.src = `data:application/pdf;base64,${data}`;
        $("#rptFrame").append(iframe);
    }

    private start() {
        console.log(this.id, this.param);
        
        if (typeof this.param === "string") this.printJobOrder(this.id, this.param);
        else if (typeof this.param === "number") this.printProforma(this.id, this.param);
    }
}