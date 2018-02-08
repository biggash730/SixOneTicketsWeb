import { ICurrency } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox, MessageTypes } from '../helpers/message_box';
import { AppServices, AngularServices } from '../helpers/config_keys';

let _ = require("underscore")

class CurrencyCtrl extends ModelController<ICurrency> implements IModelController<ICurrency>  {
    loading: boolean;
    saving: boolean;
    deleting: boolean;

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string) {
        super("Currency")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/currency`).then((response: IRequestResult<Array<ICurrency>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(currency: ICurrency) {
        this.saving = true
        let theCurrency = angular.copy(currency)
        if (theCurrency.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/currency/`, theCurrency)
                .then((response: IRequestResult<ICurrency>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/currency/`, theCurrency)
                .then((response: IRequestResult<ICurrency>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(currency: ICurrency) {
        MessageBox.confirm("Delete Currency", `Are you sure you want to delete ${currency.name}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/currency?id=${currency.id}`)
                    .then((response: IRequestResult<ICurrency>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: currency.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

}

export { CurrencyCtrl }