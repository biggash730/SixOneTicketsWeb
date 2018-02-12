import { Routes } from '../helpers/config_keys';
import { IRequestResult } from '../schemas/structure';
import { ILookUp } from '../schemas/entity_set';
let _ = require("underscore")

interface ILookUpModel {
    name: string
    label: string
    route: string
    store: string
    hidden: boolean
    privilege?: string
    
}

class LookUpModels {
    static get ProductType() { return "productTypes" }
    static get ProductCategory() { return "productCategories" }
    static get MaterialType() { return "materialTypes" }
    static get Flute() { return "flutes" }
    static get Printers() { return "printers" }
    static get Currency() { return "currencies" }
    static get SupplierCategory() { return "supplierCategories" }
    static get Supplier() { return "suppliers" }
    static get Customer() { return "customers" }
    static get Users() { return "users" }
    static get CostSetting() { return "costSetting" }
    static get PriceSetting() { return "priceSetting" }
    static get CustomerCategory() { return "customercategory" }
    static get AppSetting() { return "appSettings" }
    static get StockItem() { return "stockItems" }
    static get Production() { return "productions" }
    static get Machine() { return "machines" }
}

class LookUps {
    static get Models(): Array<ILookUpModel> {
        return [
            { label: "Ticket", name: "tickets", store: "tickets", route: Routes.TicketSettings, hidden: false },
            { label: "Royalty Packages", name: "royaltypackages", store: "royaltypackages", route: Routes.GenericSettings, hidden: false }
        ]
    };

    static get Keys() { return LookUpModels }

}

interface ILookUpService {
    fetch(model: string): angular.IPromise<IRequestResult<Array<any>>>;
    fetchCustom(route: string, filter: any): angular.IPromise<IRequestResult<Array<any>>>;
}

class LookUpService implements ILookUpService {

    static $inject = ["$q", "$http", "BASEAPI"];

    constructor(private $q: angular.IQService,
        private $http: angular.IHttpService,
        private baseUrl: string) {
    }

    fetch(lookUpStoreName: string) {
        let defer = this.$q.defer()
        let lookUp = this.getModel(lookUpStoreName)
        this.$http.get(`${this.baseUrl}/${lookUp.name}`).then((response: IRequestResult<Array<any>>) => {
            defer.resolve(response)
        })

        return defer.promise
    }

    fetchCustom(route: string, filter: any) {
        let defer = this.$q.defer()
        this.$http.post(`${this.baseUrl}/${route}`, filter).then((response: IRequestResult<Array<any>>) => {
            defer.resolve(response)
        })
        return defer.promise
    }

    private getModelName(store: string) {
        let model = _.findWhere(LookUps.Models, { store: store })
        return model.name;
    }

    private getModel(store: string): ILookUpModel {
        let model = _.findWhere(LookUps.Models, { store: store })
        return model;
    }
}

export { ILookUpModel, LookUpService, ILookUpService, LookUps }