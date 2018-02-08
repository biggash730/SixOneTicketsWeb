import { IProduction, IStockItem, IProductionMaterial, IJobOrder } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox, MessageTypes, Toast } from '../helpers/message_box';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { AppServices, AngularServices } from '../helpers/config_keys';
import { IStockItemService } from '../inventory/stockbook/stockitemservice';
import { IProductionService, IProductionQuery } from './production_service';
import { IJobOrderService } from '../job_orders/job_order_service';

let _ = require("underscore")

class ProductionsCtrl extends ModelController<IProduction> implements IModelController<IProduction>  {
    newMaterial: IProductionMaterial;
    lastFilter: IProductionQuery;
    pageNumber: number
    jobOrders: IJobOrder[];
    doEdit = false;
    stockItems: IStockItem[];

    lookUps = [LookUps.Keys.Machine, LookUps.Keys.Supplier]

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi,
    AppServices.LookUpService, AppServices.ProductionService, AppServices.JobOrderService, AppServices.StockItemService];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private lookUpService: ILookUpService,
        private productionService: IProductionService,
        private jobOrderService: IJobOrderService,
        private stockItemService: IStockItemService) {
        super("Production")
        this.fetch(<IProductionQuery>{});
        this.loadLookUps()
        this.loadJobOrders();
        this.loadAvailableStock();
    }

    editItem() {
        this.doEdit = true;
    }

    addNew() {
        this.formTitle = `Add Production`
        this.newRecord = <IProduction>{ materials: [] }
        this.setUpFormView()
    }

    addItem() {
        let material = angular.copy(this.newMaterial)
        if (!(material.item && material.quantity)) { return }
        let exist = _.findWhere(this.newRecord.materials, { itemId: material.item.id })
        if (exist) {
            Toast.info(`${material.item.name} already added.`)
            return
        }

        material.itemId = material.item.item.id
        if (material.item.item.isPaper) {
            material.reelWidth = material.reel.number
        }
        this.newRecord.materials.push(material)
        this.newMaterial = null
    }

    removeItem(index: number, material: IProductionMaterial) {
        if (material.id) {
            MessageBox.confirm("Delete Item", `Are you sure you want to delete ${material.item.name}?`).then((yes) => {
                if (yes) {
                    this.productionService.deleteItem(material.id).then((res) => {
                        if (res.success) {
                            this.newRecord.materials.splice(index, 1)
                            this.fetch(this.lastFilter)
                        }
                    })
                }
            })
        } else {
            this.newRecord.materials.splice(index, 1)
        }
    }

    edit(production: IProduction) {
        this.setUpFormView()
        this.productionService.find(production.id).then((res) => {
            if (res.success) {
                this.newRecord = res.data;
            }
        });
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true
        this.productionService.query(this.lastFilter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    }

    fetch(filter: IProductionQuery) {
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.loading = true
        this.productionService.query(filter).then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
            }
        })
    }

    saveRecord(production: IProduction) {
        this.saving = true
        let theProduction = angular.copy(production)
        if (theProduction.jobOrder) delete theProduction.jobOrder;
        theProduction.materials = theProduction.materials.map((material) => {
            // material.itemId = material.itemId
            delete material.item
            return material;
        })

        this.productionService.save(theProduction).then((res) => {
            this.saving = false
            if (res.success) {
                this.closeForm()
                this.fetch(this.lastFilter)
            }
        })
    }

    deleteRecord(production: IProduction) {
        MessageBox.confirm("Delete Production", `Are you sure you want to delete ${production.number}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.productionService.delete(production.id).then((res) => {
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

    private loadJobOrders() {
        this.loading = true;
        this.jobOrderService.production().then((res) => {
            this.loading = false;
            if (res.success) {
                this.jobOrders = res.data
            }
        });
    }

    private loadAvailableStock() {
        this.loading = true;
        this.stockItemService.availableStock().then((res) => {
            this.loading = false;
            if (res.success) {
                this.stockItems = res.data;
            }
        });
    }

}

export { ProductionsCtrl }