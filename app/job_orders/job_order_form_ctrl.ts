import { IJobOrder, IJobOrderItem, ICustomerProducts, IProduct } from '../schemas/entity_set';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { IProductService } from '../products/productservice';
import { IJobOrderService, IJobOrderQuery, JobOrderStatus } from './job_order_service';
import { MessageBox, Toast } from "../helpers/message_box"
import { Routes, AppServices, AngularServices } from '../helpers/config_keys';
let _ = require("underscore")

interface IPriceSetting {
    nhil: number
    vat: number
}

class JobOrderFormCtrl {

    title = "New Job Order";
    newJobOrder = <IJobOrder>{ items: [] };
    customerProducts: ICustomerProducts[];
    customerProduct: ICustomerProducts;
    products: IProduct[];
    product: IProduct;
    priceSetting = <IPriceSetting>{};
    saving: boolean;
    loading: boolean;
    deleting: boolean;

    lookUps = [LookUps.Keys.PriceSetting, LookUps.Keys.Currency];
    
    static $inject = [AngularServices.Scope, AngularServices.State, AngularServices.StateParams, AppServices.LookUpService, AppServices.JobOrderService, AppServices.ProductService];

    constructor(private $scope: angular.IScope,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private lookUpService: ILookUpService,
        private jobOrderService: IJobOrderService,
        private productService: IProductService) {
        this.start()
    }

    setValidityDate() {
        let date = new Date(this.newJobOrder.date.toString())
        date.setDate(date.getDate() + 14)
        this.newJobOrder.expiryDate = date;
    }

    setCustomerProducts() {
        this.newJobOrder.customerId = this.customerProduct.id;
        this.products = this.customerProduct.products;
    }

    addItem() {
        let item = angular.copy(this.product)
        if (item) {
            if(_.findWhere(this.newJobOrder.items, { productId: item.id })) {
                Toast.info(`${item.name} has already been added`)
            } else {
                this.newJobOrder.items.push(<IJobOrderItem>{ productId: item.id, product: item, profitMargin: item.profit, subTotal: 0 });
            }
        }
    }

    removeItem(item: IJobOrderItem) {
        if (item) {
            let index = _.findIndex(this.newJobOrder.items, { productId: item.productId });
            this.newJobOrder.items.splice(index, 1);
        }
    }

    getCustomerProducts() {
        this.loading = true;
        this.productService.customerProducts().then((res) => {
            this.loading = false;
            if (res.success) {
                this.customerProducts = res.data
            }
        });

    }

    calculate() {
        this.newJobOrder.total = 0;
        this.newJobOrder.items.forEach((item) => {
            item.subTotal = 0;
            if (item.quantity) {
                let costPrice = item.product.price * item.quantity
                item.subTotal = costPrice + (costPrice * (item.profitMargin / 100))
            }
            this.newJobOrder.total += item.subTotal;
        });
    }

    saveRecord() {
        if(this.newJobOrder.customerId == null) {
            Toast.info("Please select a customer");
            return;
        }
        if(this.newJobOrder.date == null) {
            Toast.info("Please select the order date");
            return;
        }
        if(this.newJobOrder.items.length == 0) {
            Toast.info("Please add a product to the job order");
            return;
        }
        let aJobOrder = angular.copy(this.newJobOrder)
        aJobOrder.items = aJobOrder.items.map((item) => {
            item.productId = item.product.id;
            item.unitPrice = item.product.price;
            item.profitMargin = item.product.profit
            delete item.product;
            item.nhil = this.priceSetting.nhil;
            item.vat = this.priceSetting.vat;
            return item;
        });
        this.saving = true
        this.jobOrderService.save(aJobOrder).then((res) => {
            this.saving = false
            if (res.success) this.$state.go(Routes.JobOrders)
        })
    }

    deleteRecord() {
        MessageBox.confirm("Delete Job Order", `Are you sure you want to delete ${this.newJobOrder.orderNumber}?`).then((yes) => {
            if (yes) {
                this.deleting = true
                this.jobOrderService.delete(this.newJobOrder.id).then((res) => {
                    this.deleting = false
                    if (res.success) { this.$state.go(Routes.JobOrders) }
                })
            }
        })
    }

    closeForm() {
        this.$state.go(Routes.JobOrders);
        this.newJobOrder = null;
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

    private getSingle(id: number) {
        this.loading = true
        this.jobOrderService.find(id).then((res) => {
            this.loading = false
            if (res.success) {
                this.newJobOrder = angular.copy(res.data);
                this.productService.customerProducts().then((res) => {
                    if (res.success) {
                        this.customerProducts = res.data
                        this.customerProduct = _.findWhere(this.customerProducts, { id: this.newJobOrder.customerId })
                        this.products = this.customerProduct.products
                        this.calculate();
                    }
                });
            }
        })
    }

    private start() {
        this.loadLookUps();
        let id = this.$stateParams['id']
        if (id) {
            this.title = "Edit Job Order"
            this.getSingle(id);
        } else {
            this.title = "New Job Order";
            this.newJobOrder = <IJobOrder>{ items: [] };
            this.getCustomerProducts();
        }
    }
}

export { JobOrderFormCtrl }