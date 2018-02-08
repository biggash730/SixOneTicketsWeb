import { IStockItem } from '../../schemas/entity_set';
import { IStockItemService } from './stockitemservice';
import { Toast, MessageBox } from "../../helpers/message_box"
import { Routes, AppServices, AngularServices } from '../../helpers/config_keys';

let _: UnderscoreStatic = require("underscore")

class StockCtrl {
    stock: IStockItem;
    loading: boolean;

    static $inject = [AngularServices.Scope, AngularServices.State, AngularServices.StateParams, AppServices.StockItemService];

    constructor(private $scope: angular.IScope,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private stockItemService: IStockItemService) {
        this.start()
    }

    getSum(index: number) {
        let total = 0;
        if (!this.stock) return total;
        this.stock.stockTable.records.forEach((item) => {
            total += item[index + 1]
        })
        return total;
    }

    private fetchStock(id: number) {
        this.loading = true
        this.stockItemService.details(id).then((res) => {
            this.loading = false
            if (res.success) {
                this.stock = angular.copy(res.data)
            }
        })
    }

    private start() {
        let id = this.$stateParams['id']
        if (id) {
            this.fetchStock(id)
        } else {
            this.$state.go(Routes.StockBook)
        }
    }

}

export { StockCtrl }