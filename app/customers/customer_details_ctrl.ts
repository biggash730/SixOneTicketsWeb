import { IModelController, ModelController } from '../schemas/structure';
import { ICustomer } from '../schemas/entity_set';
import { CustomerService, ICustomerService, ICustomerQuery } from './customers_service';
import { MessageBox } from '../helpers/message_box';
import { ILookUpService } from '../settings/lookup_service';
import { Routes, AngularServices, AppServices } from '../helpers/config_keys';

class CustomerDetailsCtrl extends ModelController<ICustomer> {

    static $inject = [AngularServices.State, AngularServices.StateParams, AppServices.LookUpService, AppServices.CustomerService];

    customerDetails: ICustomer;

    constructor(private $state: angular.ui.IStateService,
                private $stateParams: angular.ui.IStateParamsService,
                private lookupService: ILookUpService,
                private customerService: ICustomerService) {
                    super("Customer");
                    this.start();
                }

    goto(route: string, id:number) {
        this.$state.go(route, { id });
    }

    view() {
        let id = this.$stateParams['id']
        this.$state.go(Routes.CustomerFormEdit, {id});
    }

    private getDetails(id: number) {
        this.customerService.details(id).then((res) => {
            if (res.success) {
                this.customerDetails = res.data;
            }
        });
    }

    private start() {
        var id = this.$stateParams['id']
        if (id) {
            this.getDetails(id);
        }
    }
}

export {CustomerDetailsCtrl}