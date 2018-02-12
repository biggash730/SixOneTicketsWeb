/// <reference path="../typings/tsd.d.ts" />

import { PartialViews, Routes, AppServices, AppControllers } from './helpers/config_keys';
import { AppRoutes } from "./app_routes"
import { RequestInterceptor } from './services/request_interceptor';
import { MainCtrl } from "./main/main_ctrl"
import { DashboardCtrl } from "./main/dashboard_ctrl"
import { LoginCtrl } from "./authentication/login_ctrl"
import { UserProfileCtrl } from "./user_profile/user_profile_ctrl"
import { AuthService, IAuthService } from "./authentication/auth_service"
import { Authorize, UnAuthorize } from './authentication/authorize'
import { SettingsCtrl } from './settings/settings_ctrl';
import { SettingCtrl } from './settings/settings_ctrl';
import { UsersCtrl } from './admin/users_ctrl';
import { RolesCtrl } from './admin/roles_ctrl';
import { UserService } from './admin/user_service';
import { RoleService } from './admin/role_service';
import { ReportViewerCtrl } from './reports/report_viewer_ctrl';
import { ReportsCtrl } from './reports/reports_ctrl';
import { ReportsConfig } from './reports/report_config';
import { LookUpService } from './settings/lookup_service';
import { TicketSalesCtrl } from './ticket_sales/ticket_sales_ctrl';
import { TicketSaleListCtrl } from './ticket_sales/ticket_sale_list_ctrl';
import { CancelledTicketSalesCtrl } from './ticket_sales/cancelled_ticket_sales_ctrl';
import { CancelTicketSaleCtrl } from './ticket_sales/cancel_ticket_sale_ctrl';
import { PrintTicketCtrl } from './ticket_sales/print_ticket_ctrl';
import { TicketSaleService } from './ticket_sales/ticket_sale_service';
import { TicketSettingsCtrl } from './settings/ticket_settings_ctrl';

let app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.select2', 'ngAnimate', 'ngSanitize', 'alcoder.components', 'alcoder.services', 'colorpicker.module','highcharts-ng'])
	.directive(Authorize.Name, Authorize.Factory())
	.directive(UnAuthorize.Name, UnAuthorize.Factory())
	.controller(AppControllers.LoginCtrl, LoginCtrl)
	.controller(AppControllers.UserProfileCtrl, UserProfileCtrl)
	.controller(AppControllers.MainCtrl, MainCtrl)
	.controller(AppControllers.DashboardCtrl, DashboardCtrl)
	.controller(AppControllers.SettingsCtrl, SettingsCtrl)
	.controller(AppControllers.SettingCtrl, SettingCtrl)
	.controller(AppControllers.UsersCtrl, UsersCtrl)
	.controller(AppControllers.RolesCtrl, RolesCtrl)
	.controller(AppControllers.ReportsCtrl, ReportsCtrl)
	.controller(AppControllers.ReportViewerCtrl, ReportViewerCtrl)
	.controller(AppControllers.TicketSalesCtrl, TicketSalesCtrl)
    .controller(AppControllers.TicketSaleListCtrl, TicketSaleListCtrl)
    .controller(AppControllers.DashboardCtrl, DashboardCtrl)
    .controller(AppControllers.CancelledTicketSalesCtrl, CancelledTicketSalesCtrl)
    .controller(AppControllers.CancelTicketSaleCtrl, CancelTicketSaleCtrl)
	.controller(AppControllers.PrintTicketCtrl, PrintTicketCtrl)
	.controller(AppControllers.TicketSettingsCtrl, TicketSettingsCtrl )
	.service(AppServices.RequestInterceptor, RequestInterceptor)
	.service(AppServices.AuthService, AuthService)
	.service(AppServices.UserService, UserService)
	.service(AppServices.RoleService, RoleService)
	.service(AppServices.LookUpService, LookUpService)
	.service(AppServices.ReportsConfig, ReportsConfig)
	.service(AppServices.TicketSaleService, TicketSaleService)
	


app.config(AppRoutes);

app.value("BASEAPI", "api");

app.config((uibDatepickerPopupConfig: angular.ui.bootstrap.IDatepickerPopupConfig, uibDatepickerConfig: angular.ui.bootstrap.IDatepickerConfig) => {
	uibDatepickerConfig.showWeeks = false;
	uibDatepickerPopupConfig.datepickerPopup = "dd-MMMM-yyyy";
	uibDatepickerPopupConfig.clearText = "Clear";
	uibDatepickerPopupConfig.closeText = "Close";
});


app.run(($rootScope: angular.IRootScopeService, $state: angular.ui.IStateService, AuthService: IAuthService) => {
	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
		if (toState.authorize) {
			if (!AuthService.isLogin()) {
				//User is not Login
				$state.transitionTo(Routes.Login)
				event.preventDefault();
			} else if (toState.permission) {
				if (!AuthService.isAuthorize(toState.permission)) {
					//User doesn't have permission
					$state.transitionTo(Routes.UnAuthorized)
					event.preventDefault();
				}
			}
		}
	})
});

app.run(($templateCache: angular.ITemplateCacheService) => {
	$templateCache.put(PartialViews.UserForm, require("./admin/user_form.html"))
	$templateCache.put(PartialViews.RoleForm, require("./admin/role_form.html"))

	ReportsConfig.reportsList().forEach((report) => {
		if (report.lookUps) {
			$templateCache.put(`${report.name}_report`, ReportsConfig.makeFilterTemplate(report))
		}
	})
})

//Hide Preloader
$("#preloader-body").hide();

export { app }