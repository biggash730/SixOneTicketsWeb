import { IProductService, IProductQuery } from "./Productservice"
import { IProduct } from '../schemas/entity_set'
import { MessageBox } from '../helpers/message_box';
import { Routes, AppServices, AngularServices } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';
let _: UnderscoreStatic = require("underscore")

class ProductsCtrl {
    isLoading: boolean;
    lastFilter: IProductQuery;
    records: IProduct[];

    //Pager Config 
    totalRecords = 0;
    currentPage = 1;
    recordSize = 15;
    totalPages = 1;
    pageNumber = 1;

    lookUps = [LookUps.Keys.Customer, LookUps.Keys.ProductType, LookUps.Keys.ProductCategory, LookUps.Keys.MaterialType]

    static $inject = [AngularServices.State, AppServices.ProductService, AppServices.LookUpService];

    constructor(private $state: angular.ui.IStateService,
        private ProductService: IProductService,
        private lookUpService: ILookUpService) {
        this.loadLookUps()
        this.fetch(<IProductQuery>{ pager: { page: 1, size: 15 } });
    }

    createOrUpdate(id: number) {
        this.$state.go(Routes.ProductForm, { id })
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.isLoading = true
        this.ProductService.query(this.lastFilter).then((res) => {
            this.isLoading = false
            if (res.success) {
                this.records = res.data
                this.pageNumber = this.currentPage
            }
        })
    };

    fetch(filter: IProductQuery) {
        this.isLoading = true
        filter.pager = filter.pager || { page: 1, size: 15 }
        this.lastFilter = angular.copy(filter)
        this.ProductService.query(filter).then((res) => {
            this.isLoading = false
            if (res.success) {
                this.records = res.data
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
                this.pageNumber = this.currentPage
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

}

export { ProductsCtrl }