class StoreKeys {
	static get CurrentUser() { return "currentUser" }
	static get LoginLocked() { return "loginLocked" }
	static get DataChanged() { return "dataChanged" }
}

class SysMessages {
	static get RecordSaved() { return "Record saved successfully." }
	static get RecordDeleted() { return "Record deleted successfully." }
	static get OperationError() { return "Error in performing operation. Check system logs for more details" }
	static get Unauthorized() { return "You are not authorized to perform this action." }
	static get BadGateway() { return "Error connecting to server. Please check your internet connection." }
	static get NotFound() { return "Not Found. The resource you requested can not be found." }
	static get NotAllowed() { return "Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource." }
}

class Routes {
	static get Login() { return "login" }
	static get UnAuthorized() { return "unauthorized" }
	static get Dashboard() { return "dashboard" }
	static get Products() { return "products" }
	static get Product() { return "product" }
	static get ProductForm() { return "productform" }
	static get Customers() { return "customers" }
	static get CustomerForm() { return "customerform" }
	static get CustomerFormEdit() { return "customerformedit" }
	static get CustomerDetails() { return "customerdetails" }
	static get JobOrders() { return "joborders" }
	static get JobOrder() { return "joborder" }
	static get JobOrderForm() { return "joborderform" }
	static get Reports() { return "reports" }
	static get ReportViewer() { return "reportViewer" }
	static get Settings() { return "settings" }
	static get GenericSettings() { return "settings.lookup" }
	static get ProductTypeSettings() { return "settings.productType" }
	static get FluteSettings() { return "settings.flute" }
	static get ProductCategorySettings() { return "settings.productcategory" }
	static get MaterialSettings() { return "settings.materialtype" }
	static get Admin() { return "admin" }
	static get Users() { return "admin.users" }
	static get Roles() { return "admin.roles" }
	static get ChangePassword() { return "changePassword" }
	static get CurrencySetting() { return "settings.currency" }
	static get MachineSetting() { return "settings.machine" }
	static get Suppliers() { return "suppliers" } 
	static get Inventory() { return "inventory" } 
	static get Production() { return "production" } 
	static get StockBook() { return "stockbook" } 
	static get Stock() { return "stock" } 
	static get BadStock() { return "badstock" } 
	static get StockReceipt() { return "stockreceipt" } 
	static get StockIssue() { return "stockissue" } 
	static get StockItem() { return "stockitem" }

	static get TicketSales() { return "ticket_sales" }
    static get TicketSaleList() { return "ticketsalelist" }
    static get CancelledTicketSales() { return "cancelledticketsales" }
    static get CancelledTicketSalesForm() { return "cancelledticketsalesform" }
    static get CancelledTicketSalesView() { return "cancelledticketsalesview" }
}


class PartialViews{
	static get UserForm() { return "user_form" }	
	static get RoleForm() { return "role_form" }
	static get SupplierForm() {return "supplier_form"}
	static get ProductionForm() {return "production_form"}
	static get BadStockForm() {return "badstock_form"}
	static get StockIssueForm() {return "stockissue_form"}
	static get StockReceiptForm() {return "stockreceipt_form"}
}


class AngularServices {
	static get Q() { return "$q" }
	static get Http() { return "$http" }
	static get State() { return "$state" }
	static get StateParams() { return "$stateParams" }
	static get UibModal() { return "$uibModal" }
	static get Scope() { return "$scope" }
	static get RootScope() { return "$rootScope" }
	static get UibModalInstance() { return "$uibModalInstance" }
	static get Location() { return "$location" }
	static get HotKeys() { return "hotkeys" }
}

class AppServices {
    static get BaseApi() { return "BASEAPI" }
    static get AuthService() { return "AuthService" }
    static get RequestInterceptor() { return "RequestInterceptor" }
    static get CustomerService() { return "CustomerService" }
    static get ProductService() { return "ProductService" }
    static get SupplierService() { return "SupplierService" }
    static get JobOrderService() { return "JobOrderService" }
    static get UserService() { return "UserService" }
    static get RoleService() { return "RoleService" }
    // static get StockService() { return "StockService" }
    static get ReportsConfig() { return "ReportsConfig" }
    static get LookUpService() { return "LookUpService" }
    static get StatsService() { return "StatsService" }
    static get BadStockService() { return "BadStockService" }
    static get StockIssueService() { return "StockIssueService" }
    static get StockReceiptService() { return "StockReceiptService" }
    static get StockItemService() { return "StockItemService" }
    static get ProductionService() { return "ProductionService" }
    static get TicketSaleService() { return "TicketSaleService" }
}

class AppControllers {
    static get LoginCtrl() { return 'LoginCtrl' }
    static get UserProfileCtrl() { return 'UserProfileCtrl' }
    static get MainCtrl() { return 'MainCtrl' }
    static get DashboardCtrl() { return 'DashboardCtrl' }
    static get CustomersCtrl() { return 'CustomersCtrl' }
    static get CustomerDetailsCtrl() { return 'CustomerDetailsCtrl' }
    static get CustomerCtrl() { return 'CustomerCtrl' }
    static get SuppliersCtrl() { return 'SuppliersCtrl' }
    static get MaterialTypeCtrl() { return 'MaterialTypeCtrl' }
    static get ProductCtrl() { return 'ProductCtrl' }
    static get ProductsCtrl() { return 'ProductsCtrl' }
    static get ProductFormCtrl() { return 'ProductFormCtrl' }
    static get JobOrdersCtrl() { return 'JobOrdersCtrl' }
    static get JobOrderCtrl() { return 'JobOrderCtrl' }
    static get JobOrderFormCtrl() { return 'JobOrderFormCtrl' }
    static get SettingsCtrl() { return 'SettingsCtrl' }
    static get SettingCtrl() { return 'SettingCtrl' }
	static get CurrencyCtrl() {return 'CurrencyCtrl'}
	static get FluteCtrl() {return 'FluteCtrl'}
	static get ProductTypeCtrl() {return 'ProductTypeCtrl'}
    static get UsersCtrl() { return 'UsersCtrl' }
    static get RolesCtrl() { return 'RolesCtrl' }
    static get ReportsCtrl() { return 'ReportsCtrl' }    
    static get ReportViewerCtrl() { return 'ReportViewerCtrl' }  
    static get BadStocksCtrl() { return 'BadStocksCtrl' }
    static get StockIssuesCtrl() { return 'StockIssuesCtrl' }
    static get StockReceiptsCtrl() { return 'StockReceiptsCtrl' }
    static get StockBookCtrl() { return 'StockBookCtrl' }
    static get StockCtrl() { return 'StockCtrl' }
    static get ProductionsCtrl() { return 'ProductionsCtrl' }
    static get StockItemCtrl() { return 'StockItemCtrl' }
    static get ProductCategoryCtrl() { return 'ProductCategoryCtrl' }
	static get MachineCtrl() { return 'MachineCtrl' }
	static get PrintCtrl() { return 'PrintCtrl' }
	static get TicketSalesCtrl() { return "TicketSalesCtrl" }
    static get TicketSaleListCtrl() { return "TicketSaleListCtrl" }
    static get CancelledTicketSalesCtrl() { return "CancelledTicketSalesCtrl" }
    static get CancelTicketSaleCtrl() { return "CancelTicketSaleCtrl" }
    static get PrintTicketCtrl() { return "PrintTicketCtrl" }
}



export {StoreKeys, SysMessages, Routes, PartialViews, AppServices, AngularServices, AppControllers}