import { IFlute } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox,MessageTypes } from '../helpers/message_box';
import { AngularServices, AppServices } from '../helpers/config_keys';

let _ = require("underscore")

class FluteCtrl extends ModelController<IFlute> implements IModelController<IFlute>  {
    loading :boolean;
    saving :boolean;
    deleting :boolean;
    
    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string) {
        super("Flute")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/flute`).then((response: IRequestResult<Array<IFlute>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(flute: IFlute) {
        this.saving = true
        let theFlute = angular.copy(flute)
        if (theFlute.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/flute/`, theFlute)
                .then((response: IRequestResult<IFlute>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/flute/`, theFlute)
                .then((response: IRequestResult<IFlute>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(flute: IFlute) {
        MessageBox.confirm("Delete Flute", `Are you sure you want to delete ${flute.name}?`,MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/flute?id=${flute.id}`)
                    .then((response: IRequestResult<IFlute>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: flute.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

}

export {FluteCtrl}