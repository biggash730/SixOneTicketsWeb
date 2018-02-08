import { IStockItem } from '../../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../../schemas/structure'
import { MessageBox, MessageTypes } from '../../helpers/message_box';
import { AngularServices, AppServices } from '../../helpers/config_keys';
import { ILookUpService, LookUps } from '../../settings/lookup_service';
import { IStockItemService } from './stockitemservice';

let _ = require("underscore")

class StockItemCtrl extends ModelController<IStockItem> implements IModelController<IStockItem>  {
    loading: boolean;
    saving: boolean;
    deleting: boolean;

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi, AppServices.StockItemService];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private stockItemService: IStockItemService) {
        super("StockItem")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.stockItemService.get().then((res) => {
            this.loading = false
            if (res.success) {
                this.records = res.data;
            }
        })
    }

    saveRecord(stockItem: IStockItem) {
        this.saving = true
        this.stockItemService.save(stockItem).then((res) => {
            this.saving = false;
            if (res.success) {
                this.fetch();
                this.closeForm();
            }
        });
    }

    deleteRecord(stockItem: IStockItem) {
        MessageBox.confirm("Delete Stock Item", `Are you sure you want to delete ${stockItem.name}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.stockItemService.delete(stockItem.id).then((res) => {
                    this.deleting = false;
                    if (res.success){
                        this.closeForm();
                    }
                });
            }
        })
    }

    

}

export { StockItemCtrl }