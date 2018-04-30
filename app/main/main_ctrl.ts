import { IUser } from "../schemas/entity_set"
import { IAuthService } from "../authentication/auth_service"
import { MessageBox } from "../helpers/message_box"
import { Routes, AppServices, AngularServices } from '../helpers/config_keys';

interface IMenuItem {
    label: string;
    route: string;
    icon: string;
    header: boolean;
    privilege: string;
    children?: IMenuItem[];
}

class MainCtrl {
    version: string;
    username: string;
    menuItems: Array<IMenuItem>

    static $inject = [AngularServices.Q, AngularServices.RootScope, AngularServices.State, AppServices.AuthService];

    constructor(private $q: angular.IQService,
        private $rootScope: any,
        private $state: angular.ui.IStateService,
        private authenticate: IAuthService) {
        this.setVersion()
        this.setUserName()
        this.setUserMenus()
        this.$rootScope.$state = this.$state;
    }

    isLoggedIn() {
        this.setUserName()
        return this.authenticate.isLogin();
    }

    signOut() {
        this.authenticate.logOut().then((res) => {
            if (res.success) {
                this.$state.go(Routes.Login)
            }
        })
    }

    setVersion() {
        this.version = "0.0.1"
    }

    setUserName() {
        let user = this.authenticate.currentUser
        this.username = user ? user.name : ""
    }

    isAuthorize(privilege: string) {
        return this.authenticate.isAuthorize(privilege)
    }

    setUserMenus() {
        let menus: Array<IMenuItem> = [
            { label: "Dashboard", route: Routes.Dashboard, icon: "fa fa-dashboard color-aqua",privilege: "CanViewDashboard", header: false },
            { label: "Sell Ticket", route: Routes.TicketSales, icon: "fa fa-check-square color-orange", privilege: "CanSellTickets", header: false },
            { label: "Sold Tickets List", route: Routes.TicketSaleList, icon: "fa fa-list-alt color-blue", privilege: "CanViewSoldTickets", header: false },            
            { label: "Cancelled Ticket Sales", route: Routes.CancelledTicketSales, icon: "fa fa-ban color-purple", privilege: "CanViewCancelledTickets", header: false },
            { label: "Reports", route: Routes.Reports, icon: "fa fa-bar-chart-o color-teal", privilege: "CanViewReport", header: false },
            { label: "Settings", route: Routes.Settings, icon: "fa fa-cogs color-maroon", privilege: "CanViewSetting", header: false },
            { label: "Manage Users", route: Routes.Users, icon: "fa fa-users color-yellow", privilege: "CanViewAdministration", header: false }
        ]

        this.menuItems = menus;
    }
}

export { MainCtrl }