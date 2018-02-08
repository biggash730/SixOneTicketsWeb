import { IMachine} from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox, MessageTypes } from '../helpers/message_box';
import { AppServices, AngularServices } from '../helpers/config_keys';

let _ = require("underscore")

class MachineCtrl extends ModelController<IMachine> implements IModelController<IMachine>  {
    loading: boolean;
    saving: boolean;
    deleting: boolean;

    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string) {
        super("Machine")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/machine`).then((response: IRequestResult<Array<IMachine>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(machine: IMachine) {
        this.saving = true
        let themachine = angular.copy(machine)
        if (themachine.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/machine/`, themachine)
                .then((response: IRequestResult<IMachine>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/machine/`, themachine)
                .then((response: IRequestResult<IMachine>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(machine: IMachine) {
        MessageBox.confirm("Delete machine", `Are you sure you want to delete ${machine.name}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/machine?id=${machine.id}`)
                    .then((response: IRequestResult<IMachine>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: machine.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

}

export { MachineCtrl }