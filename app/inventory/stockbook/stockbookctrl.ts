import { IStockItemService, IStockItemQuery } from "./stockitemservice"
import { IStockItem } from '../../schemas/entity_set'
import { AppServices, AngularServices, Routes } from '../../helpers/config_keys';
import { ILookUpService } from '../../settings/lookup_service';
let _ = require("underscore")

class StockBookCtrl {
    //View Config
    saving: boolean;
    deleting: boolean;
    loading: boolean;

    //Data
    records: IStockItem[];

    static $inject = [AngularServices.Scope, AngularServices.State, AppServices.StockItemService, AppServices.LookUpService];

    constructor(private $scope: angular.IScope,
        private $state: angular.ui.IStateService,
        private stockItemService: IStockItemService,
        private lookUpService: ILookUpService) {
        this.start()
    }

    open(id: number) {
        this.$state.go(Routes.Stock, { id })
    }

    fetch() {
        this.loading = true
        this.stockItemService.get().then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
            }
        })
    }

    fetchAllStock() {
        this.loading = true
        this.stockItemService.allDetails().then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data
            }
        })
    }

    getSum(index: number, stock: IStockItem) {
        let total = 0;
        if (!stock) return total;
        stock.stockTable.records.forEach((item) => {
            total += item[index + 1]
        })
        return total;
    }

    private start() {
        this.fetchAllStock()
    }

}

export { StockBookCtrl }