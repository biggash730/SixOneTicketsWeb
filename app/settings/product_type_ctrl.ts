import { IProductType, IFlute, IPaper } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox, MessageTypes, Toast } from '../helpers/message_box';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { AppServices, AngularServices } from '../helpers/config_keys';

let _ = require("underscore")

class ProductTypeCtrl extends ModelController<IProductType> implements IModelController<IProductType>  {
    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi, AppServices.LookUpService];
    newPaper: IPaper;

    lookUps = [LookUps.Keys.Flute, LookUps.Keys.MaterialType]

    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string,
        private lookUpService: ILookUpService) {
        super("ProductType")
        this.fetch();
        this.loadLookUps()
    }

    addNew() {
        this.formTitle = `Add New Product Type`
        this.newRecord = <IProductType>{ papers: [] }
        this.setUpFormView()
    }

    addPaper() {
        let paper = angular.copy(this.newPaper)
        let exist = _.findWhere(this.newRecord.papers, { name: paper.name })
        if (exist) {
            Toast.warning(`${paper.name} already added.`)
            return
        }
        this.newRecord.papers.push(paper)
        this.newPaper = null
    }

    removePaper(index: number, paper: IPaper) {
        if (paper.id) {
            MessageBox.confirm("Delete Item", `Are you sure you want to delete ${paper.name}?`).then((yes) => {
                if (yes) {
                    this.$http.delete(`${this.baseUrl}/paper?id=${paper.id}`).then((res: IRequestResult<boolean>) => {
                        if (res.success) {
                            this.newRecord.papers.splice(index, 1)
                            this.fetch()
                        }
                    })
                }
            })
        } else {
            this.newRecord.papers.splice(index, 1)
        }
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/producttype`).then((response: IRequestResult<Array<IProductType>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(producttype: IProductType) {
        this.saving = true
        let theProductType = angular.copy(producttype)
        theProductType.papers = theProductType.papers.map((paper) => {
            if (paper.flute) paper.fluteId = paper.flute.id
            delete paper.flute
            return paper;
        })


        if (theProductType.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/producttype`, theProductType)
                .then((response: IRequestResult<IProductType>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/producttype`, theProductType)
                .then((response: IRequestResult<IProductType>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(producttype: IProductType) {
        MessageBox.confirm("Delete ProductType", `Are you sure you want to delete ${producttype.name}?`, MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/producttype?id=${producttype.id}`)
                    .then((response: IRequestResult<IProductType>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: producttype.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

    setUpFormView() {
        this.showForm = true
        this.gridSize = "col-sm-7"
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

export { ProductTypeCtrl }