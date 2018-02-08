import { IStockReceipt, IStockItem, IStockReceiptItem } from '../../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../../schemas/structure'
import { MessageBox, MessageTypes, Toast } from '../../helpers/message_box';
import { ILookUpService, LookUps } from '../../settings/lookup_service';
import { AppServices, AngularServices } from '../../helpers/config_keys';
import { IStockItemService } from '../stockbook/stockitemservice';
import { IStockReceiptService, IStockReceiptQuery } from './stockreceiptservice';

let _ = require("underscore")

class StockReceiptsCtrl extends ModelController<IStockReceipt> implements IModelController<IStockReceipt>  {
    newReceiptItem: IStockReceiptItem;
    lastFilter: IStockReceiptQuery;
    pageNumber: number

    lookUps = [LookUps.Keys.StockItem, LookUps.Keys.Supplier]

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi, AppServices.LookUpService, AppServices.StockReceiptService];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private lookUpService: ILookUpService,
        private stockReceiptService: IStockReceiptService) {
        super("StockReceipt")
        this.fetch(<IStockReceiptQuery>{});
        this.loadLookUps()
    }

    addNew() {
        this.formTitle = `Add Stock Receipt`
        this.newRecord = <IStockReceipt>{ items: [] }
        this.setUpFormView()
    }

    addItem() {
        let receiptItem = angular.copy(this.newReceiptItem)
        if (!(receiptItem.item && receiptItem.quantity)) { return }
        let exist = _.findWhere(this.newRecord.items, { itemId: receiptItem.item.id })
        if (exist) {
            Toast.info(`${receiptItem.item.name} already added.`)
            return
        }
        receiptItem.itemId = receiptItem.item.id
        this.newRecord.items.push(receiptItem)
        this.newReceiptItem = null
    }

    removeItem(index: number, receiptItem: IStockReceiptItem) {
        if (receiptItem.id) {
            MessageBox.confirm("Delete Item", `Are you sure you want to delete ${receiptItem.item.name}?`).then((yes) => {
                if (yes) {
                    this.stockReceiptService.deleteItem(receiptItem.id).then((res) => {
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
        this.stockReceiptService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    }

    fetch(filter: IStockReceiptQuery) {
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.loading = true
        this.stockReceiptService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    saveRecord(stockreceipt: IStockReceipt) {
        this.saving = true
        let theStockReceipt = angular.copy(stockreceipt)
        delete theStockReceipt.supplier
        theStockReceipt.items = theStockReceipt.items.map((receiptItem) => {
            receiptItem.itemId = receiptItem.item.id
            delete receiptItem.item
            return receiptItem;
        })

        this.stockReceiptService.save(theStockReceipt).then((res) => {
            this.saving = false
            if (res.success) {
                this.closeForm()
                this.fetch(this.lastFilter)
            }
        })
    }

    deleteRecord(stockreceipt: IStockReceipt) {
        MessageBox.confirm("Delete StockReceipt", `Are you sure you want to delete ${stockreceipt.number}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.stockReceiptService.delete(stockreceipt.id).then((res) => {
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
        this.gridSize = "col-sm-6"
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

export { StockReceiptsCtrl }