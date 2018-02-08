import { IProductCategory } from '../schemas/entity_set'
import { IModelController, ModelController, IRequestResult } from '../schemas/structure'
import { MessageBox,MessageTypes } from '../helpers/message_box';
import { AngularServices, AppServices } from '../helpers/config_keys';

let _ = require("underscore")

class ProductCategoryCtrl extends ModelController<IProductCategory> implements IModelController<IProductCategory>  {
    loading :boolean;
    saving :boolean;
    deleting :boolean;
    
    static $inject = [AngularServices.Http, AngularServices.Q, AppServices.BaseApi];
    constructor(private $http: angular.IHttpService,
        private $q: angular.IQService,
        private baseUrl: string) {
        super("Category")
        this.fetch();
    }

    fetch() {
        this.loading = true
        this.$http.get(`${this.baseUrl}/productcategory`).then((response: IRequestResult<Array<IProductCategory>>) => {
            this.loading = false
            this.records = response.data
        })
    }

    saveRecord(category: IProductCategory) {
        this.saving = true
        let theCategory = angular.copy(category)
        if (theCategory.id) {
            //Update Record
            this.$http.put(`${this.baseUrl}/productcategory/`, theCategory)
                .then((response: IRequestResult<IProductCategory>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        } else {
            //Save New Record
            this.$http.post(`${this.baseUrl}/productcategory/`, theCategory)
                .then((response: IRequestResult<IProductCategory>) => {
                    this.saving = false
                    if (response.success) {
                        this.fetch()
                        this.closeForm()
                    }
                })
        }
    }

    deleteRecord(category: IProductCategory) {
        MessageBox.confirm("Delete Category", `Are you sure you want to delete ${category.name}?`,MessageTypes.WARNING).then((yes) => {
            if (yes) {
                this.deleting = true
                this.$http.delete(`${this.baseUrl}/productcategory?id=${category.id}`)
                    .then((response: IRequestResult<IProductCategory>) => {
                        this.deleting = false
                        if (response.success) {
                            var recordIndex = _.findIndex(this.records, { id: category.id })
                            this.records.splice(recordIndex, 1)
                            this.closeForm()
                        }
                    })
            }
        })
    }

}

export {ProductCategoryCtrl}