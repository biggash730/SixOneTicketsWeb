import { IRequestResult, IModelService, IModelQuery } from "../schemas/structure"
import { Routes,AppServices, AngularServices } from '../helpers/config_keys';
import { ICurrency } from '../schemas/entity_set'

class DashboardCtrl {

    stats: any;
    filter: any;

	static $inject = ["$state", "$stateParams", "$http", "$q", "BASEAPI"];

	constructor(private $state: angular.ui.IStateService,
		private $stateParams: angular.ui.IStateParamsService,
		private $http: angular.IHttpService,
		private $q: angular.IQService,
		private baseUrl: string) {
		this.start()
	}

    fetch(filter: any) {
        this.$http.post(`${this.baseUrl}/dashboard/getpersonalticketstats`, filter).then((res: IRequestResult<any>) => {
            if(res.success)this.stats = res.data;
			})
    }

	start() {
        let date = new Date();
		this.filter = <any>{dateFrom:date, dateTo:date}
        this.fetch(this.filter);
	}
}

export { DashboardCtrl }