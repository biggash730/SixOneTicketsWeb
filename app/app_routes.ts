import { Routes, AppServices, AppControllers } from './helpers/config_keys';

let AppRoutes = ($stateProvider: any,
    $urlRouterProvider: angular.ui.IUrlRouterProvider,
    $httpProvider: angular.IHttpProvider) => {
    $stateProvider
        .state(Routes.Login, {
            url: '/login',
            template: require('./authentication/login.html'),
            controller: 'LoginCtrl',
            controllerAs: 'loginVm',
            menu:'',
            authorize: false,
            permission: ''
        })
         .state(Routes.UnAuthorized, {
            url: '/unauthorized',
            template: require('./authentication/unauthorized.html'),
            menu: '',
            authorize: false,
            permission: ''
        })
        .state(Routes.ChangePassword, {
            url: '/changePassword',
            template: require('./user_profile/change_password.html'),
            controller: 'UserProfileCtrl',
            controllerAs: 'profileVm',
            menu:'',
            authorize: true,
            permission: ''
        })
        .state(Routes.Dashboard, {
            url: '/dashboard',
            template: require('./main/dashboard.html'),
            controller: 'DashboardCtrl',
            controllerAs: 'dashboardVm',
            menu:'dashboard',
            authorize: true,
            permission: ''
        })
        // .state(Routes.Customers, {
        //     url: '/customer',
        //     template: require('./customers/customers.html'),
        //     controller: 'CustomersCtrl',
        //     controllerAs: 'customersVm',
        //     menu:'customers',
        //     authorize: true,
        //     permission: 'Customer.Read'
        // })
        // .state(Routes.CustomerForm, {
        //     url: '/customer/new',
        //     template: require('./customers/customer_form.html'),
        //     controller: 'CustomersCtrl',
        //     controllerAs: 'customersVm',
        //     menu:'customers',
        //     authorize: true,
        //     permission: 'Customer.Create'
        // })
        // .state(Routes.CustomerFormEdit, {
        //     url: '/customer/edit/:id',
        //     template: require('./customers/customer_form.html'),
        //     controller: 'CustomersCtrl',
        //     controllerAs: 'customersVm',
        //     menu:'customers',
        //     authorize: true,
        //     permission: 'Customer.Update'
        // })
        // .state(Routes.CustomerDetails, {
        //     url: '/customer/:id/show',
        //     template: require('./customers/customer_details.html'),
        //     controller: 'CustomerDetailsCtrl',
        //     controllerAs: 'customerDetailsVm',
        //     menu:'customers',
        //     authorize: true,
        //     permission: 'Customer.Read'
        // })
        // .state(Routes.Products, {
        //     url: '/products',
        //     template: require('./products/products.html'),
        //     controller: 'ProductsCtrl',
        //     controllerAs: 'productsVm',
        //     menu:'products',
        //     authorize: true,
        //     permission: 'Product.Read'
        // })
        // .state(Routes.Product, {
        //     url: '/product/:id/show',
        //     template: require('./products/product.html'),
        //     controller: 'ProductCtrl',
        //     controllerAs: 'productVm',
        //     menu:'products',
        //     authorize: true,
        //     permission: 'Product.Read'
        // })
        // .state(Routes.ProductForm, {
        //     url: '/productform?id',
        //     template: require('./products/productform.html'),
        //     controller: 'ProductFormCtrl',
        //     controllerAs: 'productVm',
        //     menu:'products',
        //     authorize: true,
        //     permission: 'Product.Create'
        // })
        // .state(Routes.JobOrders, {
        //     url: '/joborders',
        //     template: require('./job_orders/job_orders.html'),
        //     controller: 'JobOrdersCtrl',
        //     controllerAs: 'jobOrderVm',
        //     menu:'joborders',
        //     authorize: true,
        //     permission: 'JobOrder.Read'
        // })
        // .state(Routes.JobOrder, {
        //     url: '/joborder/:id/show',
        //     template: require('./job_orders/job_order.html'),
        //     controller: 'JobOrderCtrl',
        //     controllerAs: 'jobOrderVm',
        //     menu:'joborders',
        //     authorize: true,
        //     permission: 'JobOrder.Read'
        // })
        // .state(Routes.JobOrderForm, {
        //     url: '/joborderform?id',
        //     template: require('./job_orders/job_order_form.html'),
        //     controller: 'JobOrderFormCtrl',
        //     controllerAs: 'jobOrderVm',
        //     menu:'joborders',
        //     authorize: true,
        //     permission: 'JobOrder.Create'
        // })
        // .state(Routes.Reports, {
        //     url: '/reports',
        //     template: require('./reports/reports.html'),
        //     controller: 'ReportsCtrl',
        //     controllerAs: 'reportsVm',
        //     menu:'reports',
        //     authorize: true,
        //     permission: 'Reports'
        // })
        .state(Routes.TicketSales, {
            url: '/ticket_sales',
            template: require('./ticket_sales/ticket_sales.html'),
            controller: 'TicketSalesCtrl',
            controllerAs: 'ticketSaleVm',
            menu:'ticket_sales',
            authorize: false,
            permission: ''
        })
        .state(Routes.TicketSaleList, {
            url: '/ticket_sale_list',
            template: require('./ticket_sales/ticket_sale_list.html'),
            controller: 'TicketSaleListCtrl',
            controllerAs: 'ticketSaleVm',
            menu:'ticketsalelist',
            authorize: false,
            permission: ''
        }) 
        .state(Routes.CancelledTicketSales, {
            url: '/cancelledticketsales',
            template: require('./ticket_sales/cancelled_ticket_sales.html'),
            controller: 'CancelledTicketSalesCtrl',
            controllerAs: 'ticketsVm',
            menu:'cancelledticketsales',
            authorize: false,
            permission: ''
        }) 
        .state(Routes.CancelledTicketSalesForm, {
            url: '/cancelledticketsalesform/:id',
            template: require('./ticket_sales/cancel_ticket_sale.html'),
            controller: 'CancelTicketSaleCtrl',
            controllerAs: 'ticketsVm',
            menu:'cancelledticketsales',
            authorize: false,
            permission: ''
        }) 
        .state(Routes.ReportViewer, {
            url: '/report/:reportName',
            template: require('./reports/report_viewer.html'),
            controller: 'ReportViewerCtrl',
            controllerAs: 'rptViewerVm',
            menu: 'reports',
            authorize: true,
            permission: 'Reports'
        })
        // .state(Routes.Inventory, {
        //     url: '/inventory',
        //     template: require('./inventory/inventory.html'),
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'Inventory'
        // })
        // .state(Routes.Production, {
        //     url: '/production',
        //     template: require('./production/productions.html'),
        //     menu:'production',
        //     controller: AppControllers.ProductionsCtrl,
        //     controllerAs: 'productionVm',
        //     authorize: true,
        //     permission: 'Production.Read'
        // })
        // .state(Routes.StockBook, {
        //     url: '/stockbook',
        //     template: require('./inventory/stockbook/stockbook.html'),
        //     controller: AppControllers.StockBookCtrl,
        //     controllerAs: 'stockBookVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'StockBook'
        // })
        // .state(Routes.Stock, {
        //     url: '/stock/:id',
        //     template: require('./inventory/stockbook/stock.html'),
        //     controller: AppControllers.StockCtrl,
        //     controllerAs: 'stockVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'StockBook'
        // })
        // .state(Routes.BadStock, {
        //     url: '/badstock',
        //     template: require('./inventory/badstock/badstocks.html'),
        //     controller: AppControllers.BadStocksCtrl,
        //     controllerAs: 'badStockVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'BadStock.Read'
        // })
        // .state(Routes.StockReceipt, {
        //     url: '/stockreceipt',
        //     template: require('./inventory/stockreceipts/stockreceipts.html'),
        //     controller: AppControllers.StockReceiptsCtrl,
        //     controllerAs: 'stockreceiptVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'StockReceipt.Read'
        // })
        // .state(Routes.StockIssue, {
        //     url: '/stockissue',
        //     template: require('./inventory/stockissues/stockissues.html'),
        //     controller: AppControllers.StockIssuesCtrl,
        //     controllerAs: 'stockissueVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'StockIssue.Read'
        // })
        .state(Routes.Settings, {
            url: '/settings',
            template: require('./settings/settings.html'),
            controller: 'SettingsCtrl',
            controllerAs: 'settingsVm',
            menu:'settings',
            authorize: true,
            permission: 'Settings'
        })
        .state(Routes.GenericSettings, {
            url: '/:setting',
            template: require('./settings/generic_grid.html'),
            controller: 'SettingCtrl',
            controllerAs: 'settingVm',
            menu:'settings',
            authorize: true,
            permission: 'Settings'
        })
        // .state(Routes.CurrencySetting, {
        //     url: '/:setting/currency',
        //     template: require('./settings/currencies.html'),
        //     controller: 'CurrencyCtrl',
        //     controllerAs: 'currencyVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.MachineSetting, {
        //     url: '/:setting/machine',
        //     template: require('./settings/machines.html'),
        //     controller: 'MachineCtrl',
        //     controllerAs: 'machineVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.FluteSettings, {
        //     url: '/:setting/flute',
        //     template: require('./settings/flutes.html'),
        //     controller: 'FluteCtrl',
        //     controllerAs: 'fluteVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.ProductCategorySettings, {
        //     url: '/:setting/productcategory',
        //     template: require('./settings/product_category.html'),
        //     controller: 'ProductCategoryCtrl',
        //     controllerAs: 'categoryVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.MaterialSettings, {
        //     url: '/:setting/materialtypes',
        //     template: require('./settings/materialTypes.html'),
        //     controller: 'MaterialTypeCtrl',
        //     controllerAs: 'materialTypeVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.ProductTypeSettings, {
        //     url: '/:setting/producttypes',
        //     template: require('./settings/product_types.html'),
        //     controller: 'ProductTypeCtrl',
        //     controllerAs: 'productTypeVm',
        //     menu:'settings',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.StockItem, {
        //     url: '/stockitem',
        //     template: require('./inventory/stockbook/stockitem.html'),
        //     controller: 'StockItemCtrl',
        //     controllerAs: 'stockItemVm',
        //     menu:'inventory',
        //     authorize: true,
        //     permission: 'Settings'
        // })
        // .state(Routes.Suppliers, {
        //     url: '/suppliers',
        //     template: require('./suppliers/suppliers.html'),
        //     controller: 'SuppliersCtrl',
        //     controllerAs: 'supplierVm',
        //     menu:'suppliers',
        //     authorize: true,
        //     permission: 'Supplier.Read'
        // })
        .state(Routes.Admin, {
            url: '/admin',
            template: require('./admin/admin.html'),
            controller: 'UsersCtrl',
            controllerAs: 'usersVm',
            menu:'admin.users',
            authorize: true,
            permission: 'Administration'
        })
        .state(Routes.Users, {
            url: '/users',
            template: require('./admin/users.html'),
            controller: 'UsersCtrl',
            controllerAs: 'usersVm',
            menu:'admin.users',
            authorize: true,
            permission: 'User.Read'
        })
        .state(Routes.Roles, {
            url: '/roles',
            template: require('./admin/roles.html'),
            controller: 'RolesCtrl',
            controllerAs: 'rolesVm',
            menu:'admin.users',
            authorize: true,
            permission: 'Role.Read'
        })

    $urlRouterProvider.otherwise(Routes.Dashboard);
    $httpProvider.interceptors.push(AppServices.RequestInterceptor)
}

export {AppRoutes}