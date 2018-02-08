import { AngularServices, AppServices, Routes } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { IProductService } from './productservice';
import { IProduct } from '../schemas/entity_set';

class ProductCtrl {

    productDetails: IProduct;

    lookUps = [LookUps.Keys.Currency]

    static $inject = [AngularServices.State, AngularServices.StateParams, AppServices.LookUpService, AppServices.ProductService];

    constructor(private $state: angular.ui.IStateService,
                private $stateParams: angular.ui.IStateParamsService,
                private lookUpService: ILookUpService,
                private productService: IProductService) {
                    this.start();
    }

    viewOrUpdate(id: number) {
        this.$state.go(Routes.ProductForm, { id })
    }

    private getDetails(id: number) {
        this.productService.details(id).then((res => {
            if (res.success) {
                this.productDetails = res.data;
            }
        }));
    }

     private loadLookUps() {
        let self: any = this;
        this.lookUps.forEach((lookup) => {
            this.lookUpService.fetch(lookup).then((res) => {
                if (res.success) {
                    self[lookup] = res.data
                }
            })
        })
    }

    private start() {
        let id = this.$stateParams['id']
        if (id) {
            this.getDetails(id);
            this.loadLookUps();
        }
    }
}

export {ProductCtrl}