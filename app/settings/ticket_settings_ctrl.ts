import { ModelController, IRequestResult, IModelController } from "../schemas/structure";
import { AngularServices, AppServices } from "../helpers/config_keys";
import { MessageBox, MessageTypes } from "../helpers/message_box";
import { ITicket } from "../schemas/entity_set";

let _ = require("underscore");

class TicketSettingsCtrl extends ModelController<ITicket> implements IModelController<ITicket> {

    loading :boolean;
    saving :boolean;
    deleting :boolean;

    types = ["Regular", "Member"];
    statuses = ["Pending", "Active", "Cancelled"]
    
    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi];

    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string) {
        super("Ticket")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.$http.post(`${this.baseUrl}/tickets/query`, {}).then((response: IRequestResult<Array<ITicket>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(ticket: ITicket) {
        this.saving = true
        let aTicket = angular.copy(ticket)
        if (aTicket.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/tickets/`, aTicket)
                .then((response: IRequestResult<ITicket>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/tickets/`, aTicket)
                .then((response: IRequestResult<ITicket>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(ticket: ITicket) {
        MessageBox.confirm("Delete Category", `Are you sure you want to delete ${ticket.title}?`,MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/tickets?id=${ticket.id}`)
                    .then((response: IRequestResult<ITicket>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: ticket.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

}

export { TicketSettingsCtrl }