let _ = require('underscore')
import { Utils } from '../helpers/utils';
import { JobOrderStatus } from '../job_orders/job_order_service';
class InputType {
    static get Text() { return "text" }
    static get Date() { return "date" }
    static get Number() { return "number" }
    static get Select() { return "select" }
    static get Search() { return "search" }
}

interface IReportLookUp {
    id: string;
    name: string;
    label: string;
    type: string;
    store?: string;
    displayField?: string;
    idField?: string;
    source?: Array<any>;
    filter?: any;
}

interface IReport {
    name: string;
    title: string;
    notes: string;
    icon?: string;
    dateFilter?: boolean;
    lookUps?: IReportLookUp[];
    query: string;
}

interface IReportGroup {
    name: string;
    reports: IReport[];
}

const Reports: IReportGroup[] = [
    {
        name: "General Reports",
        reports: [
            {
                name: "product",
                title: "Products List Report",
                notes: "This report is used to list all of the items which it’s quantities has fallen below the minimum order level.",
                query: "reports/product",
                dateFilter: false,
                lookUps: [
                    { id: 'typeId', label: "Type", name: 'productType', store: "productTypes", type: InputType.Select },
                    { id: 'categoryId', label: "Category", name: 'productCategory', store: "productCategories", type: InputType.Select },
                ]
            },
            {
                name: "suppliers",
                title: "Supplier List Report",
                notes: "Report on purchase returned back to supplier within a specified peroid indicating delivery location.",
                query: "reports/supplier",
                dateFilter: false,
                lookUps: [
                    { id: 'categoryId', label: "Category", name: 'supplierCategory', store: "supplierCategories", type: InputType.Select }
                ]
            },
            {
                name: "customers",
                title: "Customer List Report",
                notes: "Report on purchase returned back to supplier within a specified peroid indicating delivery location.",
                query: "reports/customer",
                dateFilter: false,
                lookUps: [
                    { id: 'categoryId', label: "Category", name: 'customercategory', store: "customercategory", type: InputType.Select }
                ]
            },
            {
                name: "joborders",
                title: "Job Order List",
                notes: "Report on purchase returned back to supplier within a specified peroid indicating delivery location.",
                query: "reports/joborder",
                dateFilter: true,
                lookUps: [
                    { id: 'customerId', label: "Customer", name: 'customer', store: "customers", type: InputType.Select },
                    {
                        id: 'status', label: "Status", name: 'status', store: "statuses",
                        source: [JobOrderStatus.Cancelled, JobOrderStatus.ProForma, JobOrderStatus.JobOrder, JobOrderStatus.Production, JobOrderStatus.Printing, JobOrderStatus.Delivered],
                        type: InputType.Select
                    },
                    // { id: 'locationId', label: "Delivery Location", name: 'location', store: "locations", type: InputType.Select }
                ]
            }
        ]
    }
];

class ReportsConfig {
    static getReports() {
        return Reports;
    }

    static reportsList() {
        let reports: IReport[] = [];
        Reports.forEach((group) => {
            reports.push.apply(reports, group.reports)
        })
        return reports;
    }

    static getReport(name: string) {
        let reports: IReport[] = [];
        Reports.forEach((group) => {
            reports.push.apply(reports, group.reports)
        })

        return _.findWhere(reports, { name });
    }

    static makeFilterTemplate(report: IReport) {
        let template = "";
        report.lookUps.forEach((control) => {
            template += this.createControl(control)
        })
        return template
    }

    private static createControl(model: IReportLookUp) {
        let control = ""
        switch (model.type) {
            case InputType.Select:
                let selectId = (model.idField) ? "item." + model.idField : "item.id"
                let selectText = (model.displayField) ? `${selectId} as item.` + model.displayField : `${selectId} as item.name`
                control = `<div class="form-group">
                            <label>${model.label}</label>
                            <select ui-select2="{allowClear:true}" class="form-control" ng-model="rptViewerVm.filter.${model.id}" 
                                ng-options="${(model.id == model.name) ? 'item' : selectText} for item in rptViewerVm.${model.store}">
                                <option></option>
                            </select>
                        </div>`
                break;
            case InputType.Date:
                let key = Utils.makeid(5)
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input type="text" uib-datepicker-popup="dd-MMMM-yyyy" class="form-control" ng-model="rptViewerVm.filter.${model.id}"
                                is-open="d${key}.isOpen" ng-click="d${key}.isOpen=true" placeholder="Click to select date" />
                           </div>`
                break;
            case InputType.Text:
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input type="text" class="form-control" ng-model="rptViewerVm.filter.${model.id}" />
                           </div>`
                break;
            case InputType.Search:
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input ui-select2="rptViewerVm.searchConfig()" class="form-control" ng-model="rptViewerVm.filter.${model.id}" />
                           </div>`
                break;
            default:
                break;
        }

        return control;
    }


}

export { IReport, IReportGroup, ReportsConfig, InputType, IReportLookUp }