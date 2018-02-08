import { ISupplierService, ISupplierQuery } from "./supplier_service"
import { ISupplier } from '../schemas/entity_set'
import { IModelController, ModelController } from '../schemas/structure'
import { MessageBox } from '../helpers/message_box';
import { AppServices } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';
let _: UnderscoreStatic = require("underscore")

class SuppliersCtrl extends ModelController<ISupplier> implements IModelController<ISupplier>  {
    lastFilter: ISupplierQuery;
    pageNumber: number

    lookUps = [LookUps.Keys.SupplierCategory]

    static $inject = [AppServices.SupplierService, AppServices.LookUpService];

    constructor(private supplierService: ISupplierService, private lookUpService: ILookUpService) {
        super("Supplier")
        this.start()
    }

    // addNew() {
    //     this.formTitle = "New Supplier"
    //     this.newRecord = <ISupplier>{isActive: true}
    //     this.setUpFormView()
    // }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.supplierService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    }

    fetch(filter: ISupplierQuery) {
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.loading = true
        this.supplierService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    saveRecord(supplier: ISupplier) {
        this.saving = true
        let theSupplier = angular.copy(supplier);
        delete theSupplier.category
        this.supplierService.save(theSupplier).then((res) => {
            this.saving = false
            if (res.success) {
                this.closeForm()
                this.fetch(this.lastFilter)
            }
        })
    }

    deleteRecord(supplier: ISupplier) {
        MessageBox.confirm("Delete Supplier", "Are you sure you want to delete record").then((yes) => {
            if (yes) {
                this.deleting = true
                this.supplierService.delete(supplier.id).then((res) => {
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
        this.fetch(<ISupplierQuery>{})
    }

}

export { SuppliersCtrl }