let _ = require('underscore')
import { Utils } from '../helpers/utils';

class InputType {
    static get Text() { return "text" }
    static get Date() { return "date" }
    static get Number() { return "number" }
    static get Select() { return "select" }
    static get MultiSelect() { return "multiselect" }
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
    isCustom?: boolean;
    route?: string;
    isOptional?: boolean;    
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
        name: "Ticket Reports",
        reports: [
            {
                name: "ticketslistreport",
                title: "Available Tickets",
                notes: "Generate a report of all available tickets with their statuses and types.",
                query: "ticketslist",
                lookUps:[
                    { id: 'status', label: "Status", name: 'status', store: "status", source: ["Pending", "Active", "Cancelled"], type: InputType.Select, isOptional: true }
                ]
            },
            {
                name: "ticketsalesreport",
                title: "Ticket Sales Report",
                notes: "Report on the list of tickets sold for a period",
                query: "ticketsales",
                dateFilter: true,
            },
            {
                name: "cancelledticketsalesreport",
                title: "Cancelled Ticket Sales",
                notes: "Report on all sold tickets that have been cancelled for a period",
                query: "cancelledticketsales",
                dateFilter: true,
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
                            <select ui-select2="{allowClear:true}" class="form-control" ng-model="rptViewerVm.filter.${model.id}" requiredx
                                ng-options="${(model.id == model.name) ? 'item' : selectText} for item in rptViewerVm.${model.store}">
                                <option></option>
                            </select>
                        </div>`
                break;
            case InputType.MultiSelect:
                control = `<div class="form-group">
                            <label>${model.label}</label>
                            <select multiple="" ui-select2="{}" class="form-control" ng-model="rptViewerVm.filter.${model.id}" requiredx
                                ng-options="item for item in rptViewerVm.${model.store}">                                
                            </select>
                        </div>`
                break;
            case InputType.Date:
                let key = Utils.makeid(5)
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input type="text" uib-datepicker-popup="dd-MMMM-yyyy" class="form-control" ng-model="rptViewerVm.filter.${model.id}"
                                is-open="d${key}.isOpen" ng-click="d${key}.isOpen=true" placeholder="Click to select date"  requiredx />
                           </div>`
                break;
            case InputType.Text:
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input type="text" class="form-control" ng-model="rptViewerVm.filter.${model.id}" requiredx/>
                           </div>`
                break;
            case InputType.Search:
                control = `<div class="form-group">
                                <label>${model.label}</label>
                                <input ui-select2="rptViewerVm.searchConfig()" class="form-control" ng-model="rptViewerVm.filter.${model.id}"  requiredx/>
                           </div>`
                break;
            default:
                break;
        }

        if(model.isOptional && !model.isOptional){
            control = control.replace("requiredx", "required");
        }

        return control;
    }


}

export {IReport, IReportGroup, ReportsConfig, InputType, IReportLookUp}