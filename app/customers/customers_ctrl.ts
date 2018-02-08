import { IModelController, ModelController } from '../schemas/structure';
import { ICustomer, IContact } from '../schemas/entity_set';
import { CustomerService, ICustomerService, ICustomerQuery } from './customers_service';
import { MessageBox, Toast } from '../helpers/message_box';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { Routes, AngularServices, AppServices } from '../helpers/config_keys';

let _ = require("underscore");

class CustomersCtrl extends ModelController<ICustomer>{

    lastFilter: ICustomerQuery;
    customerCategories: any[];
    newContact: IContact;


    static $inject = [AngularServices.Http, AngularServices.State, AngularServices.StateParams, AppServices.LookUpService,AppServices.CustomerService];

    constructor(private $http: angular.IHttpService,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private lookupService: ILookUpService,
        private customerService: ICustomerService) {
        super("Customer");
        this.start();
    }

    addContact() {
        let contact = angular.copy(this.newContact)
        let exist = _.findWhere(this.newRecord.contacts, { name: contact.name })
        if (exist) {
            Toast.warning(`${contact.name} already added.`)
            return
        }
        this.newRecord.contacts.push(contact)
        this.newContact = null
    }

    removeContact(index: number, contact: IContact) {
        if (contact.id) {
            MessageBox.confirm("Delete Item", `Are you sure you want to delete ${contact.name}?`).then((yes) => {
                if (yes) {
                    this.customerService.deleteContact(contact.id).then((res) => {
                        if (res.success) {
                            this.newRecord.contacts.splice(index, 1);
                        }
                    });
                }
            })
        } else {
            this.newRecord.contacts.splice(index, 1);
        }
    }

    saveRecord(customer: ICustomer) {
        let theCustomer = angular.copy(customer);
        delete theCustomer.category
        this.saving = true;
        this.customerService.save(theCustomer).then((res) => {
            this.saving = false;
            if (res.success) {
                this.fetch(<ICustomerQuery>{});
                this.closeForm();
            }
        });
    }

    deleteRecord(customer: ICustomer) {
        MessageBox.confirm("Delete Customer", "Are you sure you want to delete this customer record?").then((yes) => {
            if (yes) {
                this.deleting = true;
                this.customerService.delete(customer.id).then((res) => {
                    this.deleting = false;
                    if (res.success) {
                        this.fetch(<ICustomerQuery>{});
                        this.closeForm();
                    }
                });
            }
        });
    }

    fetch(filter: ICustomerQuery) {
        this.loading = true;
        filter.pager = filter.pager || { page: 1, size: this.recordSize };
        this.lastFilter = angular.copy(filter);
        this.customerService.query(filter).then((res) => {
            this.loading = false;
            if (res.success) {
                this.records = res.data;
                this.totalRecords = res.total;
                this.totalPages = Math.ceil(res.total / this.recordSize);
            }
        });
    }

    pageChanged(page: number) {
        this.currentPage = page;
        this.lastFilter.pager.page = page;
        this.loading = true;
        this.customerService.query(this.lastFilter).then((res) => {
            this.loading = false;
            if (res.success) {
                this.records = res.data;
            }
        });
    }

    view(id: number) {
        this.$state.go(Routes.CustomerDetails, { id });
    }

    closeForm() {
        this.$state.go(Routes.Customers);
        this.clear();
    }

    private loadCustomerCategories() {
        this.lookupService.fetch("customercategory").then((res) => {
            if (res.success) { this.customerCategories = res.data }
        })
    }

    private getSingle(id: number) {
        this.customerService.find(id).then((res) => {
            if (res.success) {
                this.newRecord = res.data;
            }
        });
    }

    private start() {
        this.loadCustomerCategories();
        var id = this.$stateParams['id']
        if (id) {
            this.getSingle(id);
        } else {
            if (this.$state.current.name == Routes.CustomerForm) {
                this.newRecord = <ICustomer>{ isActive: true, isFreeZone: false, contacts: [] }
            } else {
                this.fetch(<ICustomerQuery>{});
            }
        }
    }

}

export { CustomersCtrl }