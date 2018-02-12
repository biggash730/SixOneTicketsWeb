import { Toast } from '../helpers/message_box';
import { IReport, ReportsConfig, IReportLookUp } from './report_config';
import { ILookUpService } from '../settings/lookup_service';
import { IRequestResult } from '../schemas/structure';
let _ = require('underscore');

class ReportViewerCtrl {
    loading: boolean;
    loaded: boolean;
    downloading: boolean;
    report: IReport;
    companyId: number;
    filter: any;
    months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    static $inject = ["$q", "$http", "BASEAPI", "$state", "$stateParams", "LookUpService"];
    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private lookUpService: ILookUpService) {
        this.start()
        this.fetchLookUps()
    }

    run() {        
        let filter = this.filter;
        filter.companyId = this.companyId;
        let filtr = angular.copy(filter)
        if(filtr.month){
            filtr.month = (_.indexOf(this.months, filtr.month) + 1)
        }
        this.loading = true
        
        this.$http.post(`${this.baseUrl}/reports/${this.report.query}`, filtr || {}).then((res: IRequestResult<string>) => {
            this.loading = false
            this.clearPreview()
            if (res.success) {
                if(res.message == "Download Report"){
                    var data = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"+res.data;
                window.open(data, "_blank", "")
            }
            else{
                this.showReport(res.data) 
                 this.loaded = true;
            }
                 
                }
        })
    }

    download() {        
        let filter = this.filter;
        filter.companyId = this.companyId;
        let filtr = angular.copy(filter)
        if(filtr.month){
            filtr.month = (_.indexOf(this.months, filtr.month) + 1)
        }
        this.downloading = true        
        this.$http.post(`${this.baseUrl}/reports/download/${this.report.query}`, filtr || {}).then((res: IRequestResult<string>) => {
            this.downloading = false
            if (res.success) {
                var data = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"+res.data;
                window.open(data, "_blank", "")
                 
                }
        })
    }

    private fetchLookUps() {
        //console.log(11)
        if (!(this.report && this.report.lookUps)) return;
        let self: any = this;
        this.report.lookUps.forEach((lookUp) => {
            if (lookUp.source) {
                //Set lookup data from source
                self[lookUp.store] = lookUp.source
            } else {
                if (lookUp.isCustom) {
                    var filter = <any>{};
                    this.lookUpService.fetchCustom(lookUp.route, filter).then((res) => {
                        self[lookUp.store] = res.data
                    })
                } else {
                    //Fetch lookUp Data
                    
                    this.lookUpService.fetch(lookUp.name).then((res) => {
                        self[lookUp.store] = (lookUp.filter) ? _.where(res.data, lookUp.filter) : res.data
                    })
                }
            }
        })
    }

    private clearPreview() { $("#pdfFrame").remove(); }

    private showReport(data: string) {
        let iframe = document.createElement("iframe");
        iframe.style["width"] = '100%'
        iframe.id = "pdfFrame";
        iframe.src = `data:application/pdf;base64,${data}`;
        $("#rptFrame").append(iframe);
        window.scroll(0, 0)
    }

    private start() {
        this.filter = {};
        //this.filter.tags = []
        this.loaded = false;
        let reportName = this.$stateParams['reportName'];
        this.report = angular.copy(ReportsConfig.getReport(reportName))
        if (!this.report) { Toast.error("Report not found.") }

        //console.log(this.report)
    }
}

export { ReportViewerCtrl }