import { IMaterialType } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox, MessageTypes } from '../helpers/message_box';
import { AngularServices, AppServices } from '../helpers/config_keys';
import { ILookUpService, LookUps } from '../settings/lookup_service';

let _ = require("underscore")

class MaterialTypeCtrl extends ModelController<IMaterialType> implements IModelController<IMaterialType>  {
    loading: boolean;
    saving: boolean;
    deleting: boolean;

    lookUps = [LookUps.Keys.Flute]
    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi, AppServices.LookUpService];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private lookUpService: ILookUpService) {
        super("MaterialType")
        this.loadLookUps()
        this.fetch();
    }

    calculate() {
        this.newRecord.totalCharge = this.newRecord.bankRate + this.newRecord.vatRate + this.newRecord.portRate
            + this.newRecord.manufacturingRate + this.newRecord.miscellaneousRate;
        let fluteRate = (this.newRecord.flute) ? this.newRecord.flute.rate : 1;
        this.newRecord.price = this.newRecord.cost + ((this.newRecord.cost * this.newRecord.totalCharge) * fluteRate)
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/materialType`).then((response: IRequestResult<Array<IMaterialType>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(materialType: IMaterialType) {
        this.saving = true
        let theMaterialType = angular.copy(materialType)
        if (theMaterialType.flute) theMaterialType.fluteId = theMaterialType.flute.id
        delete theMaterialType.flute
        // theMaterialType.totalCharge = Math.round(theMaterialType.totalCharge)
        if (theMaterialType.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/materialType/`, theMaterialType)
                .then((response: IRequestResult<IMaterialType>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/materialType/`, theMaterialType)
                .then((response: IRequestResult<IMaterialType>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(materialType: IMaterialType) {
        MessageBox.confirm("Delete MaterialType", `Are you sure you want to delete ${materialType.name}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/materialType?id=${materialType.id}`)
                    .then((response: IRequestResult<IMaterialType>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: materialType.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
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

}

export { MaterialTypeCtrl }