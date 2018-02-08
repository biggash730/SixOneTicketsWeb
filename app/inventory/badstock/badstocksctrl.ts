import { IBadStockService, IBadStockQuery } from "./badstockservice"
import { IBadStock } from '../../schemas/entity_set'
import { IModelController, ModelController } from '../../schemas/structure'
import { MessageBox } from '../../helpers/message_box';
import { AppServices } from '../../helpers/config_keys';
import { ILookUpService, LookUps } from '../../settings/lookup_service';
let _: UnderscoreStatic = require("underscore")

class BadStocksCtrl extends ModelController<IBadStock> implements IModelController<IBadStock>  {
    lastFilter: IBadStockQuery;
    pageNumber: number

    lookUps = [LookUps.Keys.StockItem]

    static $inject = [AppServices.BadStockService, AppServices.LookUpService];

    constructor(private badstockService: IBadStockService, private lookUpService: ILookUpService) {
        super("BadStock")
        this.start()
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.badstockService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    }

    fetch(filter: IBadStockQuery) {
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.loading = true
        this.badstockService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    saveRecord(badstock: IBadStock) {
        this.saving = true
        let theBadStock = angular.copy(badstock);
        delete theBadStock.item
        this.badstockService.save(theBadStock).then((res) => {
            this.saving = false
            if (res.success) {
                this.closeForm()
                this.fetch(this.lastFilter)
            }
        })
    }

    deleteRecord(badstock: IBadStock) {
        MessageBox.confirm("Delete BadStock", "Are you sure you want to delete record").then((yes) => {
            if (yes) {
                this.deleting = true
                this.badstockService.delete(badstock.id).then((res) => {
                    this.deleting = false
                    if (res.success) {
                        this.closeForm()
                        this.fetch(this.lastFilter)
                    }
                })
            }
        })
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
        this.loadLookUps()
        this.fetch(<IBadStockQuery>{})
    }

}

export { BadStocksCtrl }