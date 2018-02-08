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
            { label: "Product Type", name: "productType", store: LookUpModels.ProductType, route: Routes.ProductTypeSettings, hidden: false },
            { label: "Product Category", name: "productCategory", store: "productCategories", route: Routes.ProductCategorySettings, hidden: false },
            { label: "Material Type", name: "materialType", store: "materialTypes", route: Routes.MaterialSettings, hidden: false },
            { label: "Machine", name: "machine", store: "machines", route: Routes.MachineSetting, hidden: false },
            { label: "Flute", name: "flute", store: "flutes", route: Routes.FluteSettings, hidden: false },
            { label: "Currency", name: "currency", store: "currencies", route: Routes.CurrencySetting, hidden: false },
            { label: "Supplier Category", name: "supplierCategory", store: "supplierCategories", route: Routes.GenericSettings, hidden: false },
            { label: "Supplier", name: "supplier", store: "suppliers", route: Routes.GenericSettings, hidden: true },
            { label: "Customer", name: "customer", store: "customers", route: Routes.GenericSettings, hidden: true },
            { label: "Printers", name: "printer", store: "printers", route: Routes.GenericSettings, hidden: false },
            { label: "Machines", name: "machine", store: "machines", route: Routes.GenericSettings, hidden: false },
            { label: "StockItem", name: "stockItem", store: "stockItems", route: Routes.StockItem, hidden: true },
            { label: "Users", name: "user", store: "users", route: Routes.GenericSettings, hidden: true },
            { label: "Production", name: "production", store: "productions", route: Routes.GenericSettings, hidden: true },
            { label: "Cost Settings", name: "costSetting", store: "costSetting", route: Routes.GenericSettings, hidden: true },
            { label: "Price Setting", name: "priceSetting", store: "priceSetting", route: Routes.GenericSettings, hidden: true },
            { label: "Customer Category", name: "customercategory", store: "customercategory", route: Routes.GenericSettings, hidden: false },
            { label: "App Setting", name: "appsetting", store: "appSettings", route: Routes.GenericSettings, hidden: false }
        ]
    };

    static get Keys() { return LookUpModels }

}

interface ILookUpService {
    fetch(model: string): angular.IPromise<IRequestResult<Array<any>>>;
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