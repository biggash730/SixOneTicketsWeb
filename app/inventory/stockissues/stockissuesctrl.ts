import { IStockIssue, IStockItem, IStockIssueItem } from '../../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../../schemas/structure'
import { MessageBox, MessageTypes, Toast } from '../../helpers/message_box';
import { ILookUpService, LookUps } from '../../settings/lookup_service';
import { AppServices, AngularServices } from '../../helpers/config_keys';
import { IStockItemService } from '../stockbook/stockitemservice';
import { IStockIssueService, IStockIssueQuery } from './stockissueservice';

let _ = require("underscore")

class StockIssuesCtrl extends ModelController<IStockIssue> implements IModelController<IStockIssue>  {
    newIssueItem: IStockIssueItem;
    lastFilter: IStockIssueQuery;
    pageNumber: number

    lookUps = [LookUps.Keys.StockItem, LookUps.Keys.Production]

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi, AppServices.LookUpService, AppServices.StockIssueService];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private lookUpService: ILookUpService,
        private stockIssueService: IStockIssueService) {
        super("StockIssue")
        this.fetch(<IStockIssueQuery>{});
        this.loadLookUps()
    }

    addNew() {
        this.formTitle = `Add Stock Issue`
        this.newRecord = <IStockIssue>{}
        this.setUpFormView()
    }

    addItem() {
        let issueItem = angular.copy(this.newIssueItem)
        let exist = _.findWhere(this.newRecord.items, { itemId: this.newIssueItem.itemId })
        if (exist) {
            Toast.warning(`${issueItem.item.name} already added.`)
            return
        }
        issueItem.itemId = issueItem.item.id
        this.newRecord.items.push(issueItem)
        this.newIssueItem = null
    }

    removeItem(index: number, issueItem: IStockIssueItem) {
        if (issueItem.id) {
            MessageBox.confirm("Delete Item", `Are you sure you want to delete ${issueItem.item.name}?`).then((yes) => {
                if (yes) {
                    this.stockIssueService.deleteItem(issueItem.id).then((res) => {
                        if (res.success) {
                            this.newRecord.items.splice(index, 1)
                            this.fetch(this.lastFilter)
                        }
                    })
                }
            })
        } else {
            this.newRecord.items.splice(index, 1)
        }
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.stockIssueService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    }

    fetch(filter: IStockIssueQuery) {
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.loading = true
        this.stockIssueService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    saveRecord(stockissue: IStockIssue) {
        this.saving = true
        let theStockIssue = angular.copy(stockissue)
        theStockIssue.productionId = theStockIssue.production.id
        delete theStockIssue.production
        theStockIssue.items = theStockIssue.items.map((issueItem) => {
            issueItem.itemId = issueItem.item.id
            delete issueItem.item
            return issueItem;
        })

        this.stockIssueService.save(theStockIssue).then((res) => {
            this.saving = false
            if (res.success) {
                this.closeForm()
                this.fetch(this.lastFilter)
            }
        })
    }

    deleteRecord(stockissue: IStockIssue) {
        MessageBox.confirm("Delete StockIssue", `Are you sure you want to delete ${stockissue.number}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.stockIssueService.delete(stockissue.id).then((res) => {
                    this.deleting = false
                    if (res.success) {
                        this.closeForm()
                        this.fetch(this.lastFilter)
                    }
                })
            }
        })
    }

    setUpFormView() {
        this.showForm = true
        this.gridSize = "col-sm-7"
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

export { StockIssuesCtrl }