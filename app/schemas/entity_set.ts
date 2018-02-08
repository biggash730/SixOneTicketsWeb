interface IhasId {
	id: number
}

interface IAuditFields extends IhasId {
	createdAt: Date
	createdBy: string
	modifiedAt: Date
	modifiedBy: string
}

interface ILookUp extends IAuditFields {
	name: string
	notes: string
}

interface IUser {
	id: number
	username: string
	name: string
	token: string
	role: IRole
}

interface IRole extends IAuditFields {
	name: string
	privileges: Array<string>
}

interface ICurrency extends IAuditFields {
	name: string
	symbol: string
	rate: number
}
interface ISupplierCategory extends IAuditFields {
	name: string
	notes: string
}

interface ISupplier extends IAuditFields {
	name: string
	address: string
	phonenumber: string
	email: string
	category: ISupplierCategory
	isActive: boolean
}

interface IFlute extends ILookUp {
	rate: number
}

interface IProductType extends ILookUp {
	boardWidthRate: number
	priceConversionRate: number
	papers: IPaper[]
}

interface IPaper extends ILookUp {
	name: string
	flute: IFlute
	fluteId: number
}

interface IProductCategory extends ILookUp {
	equalProductAndBoardDimension: boolean
	multipleOutsPerBoard: boolean
	includesDie: boolean
}

interface IMaterialType extends ILookUp {
	cost: number
	bankRate: number
	vatRate: number
	portRate: number
	manufacturingRate: number
	totalCharge: number
	price: number
	miscellaneousRate: number
	flute: IFlute
	fluteId: number
}
interface ICustomerCategory extends ILookUp { }

interface ICustomer extends IAuditFields {
	name: string
	address: string
	phoneNumber: string
	email: string
	isFreeZone: boolean
	isActive: boolean
	categoryId: number
	category: ICustomerCategory
	contacts: IContact[]
	contactId: number
}

interface IProduct extends IAuditFields {
	name: string
	customer: ICustomer
	customerId: number
	category: IProductCategory
	categoryId: number
	type: IProductType
	typeId: number
	materialType: IMaterialType
	materialTypeId: number
	hasFonLogo: boolean
	hasStitching: boolean
	hasGlue: boolean
	hasPrinting: boolean
	colour1: number
	colour2: number
	colour3: number
	colour4: number
	profit: number
	amount: number
	length: number
	width: number
	height: number
	gsm: number
	boardLength: number
	boardWidth: number
	boardLengthWithoutFlap: number
	boardWeight: number
	numberOfOuts: number
	reelWidth: number
	outWidth: number
	trim: number
	waste: number
	totalBoardWeight: number
	price: number
	paperCombinations: IPaperCombination[]
	artwork: string
	outsPerBoard: number
	dieCost: number
	projectedQuantity: number
	clearingCostPercentage: number
}

interface IPaperCombination extends IhasId {
	product: IProduct
	productId: number
	paper: IPaper
	paperId: number
	materialType: IMaterialType
	materialTypeId: number
	quantity: number
}

interface IJobOrder extends IAuditFields {
	date: Date
	customer: ICustomer
	customerId: number
	orderNumber: string
	referenceNumber: number
	status: string
	total: number
	expiryDate?: Date
	items: IJobOrderItem[]
}

interface IJobOrderItem extends IhasId {
	product: IProduct
	productId: number
	unitPrice: number
	price: number
	quantity: number
	subTotal: number
	vat: number
	nhil: number
	profitMargin: number
	jobOrder: IJobOrder
	jobOrderId: number
	expanded: boolean
}

interface ICustomerProducts extends IhasId {
	id: number
	name: string
	products: IProduct[]
}

interface IStockItem extends IAuditFields {
	name: string
	notes: string
	quantity: number
	weight: number
	stockTable: { gsmList: number[], records: Array<number[]> }
	item: { id: number, isPaper: boolean }
}

interface IStockDiary extends IAuditFields {
	timeStamp: Date
	item: IStockItem
	itemId: number
	quantity: number
	balance: number
	referenceId: number
	referenceCode: string
	notes: string
}

interface IBadStock extends IAuditFields {
	date: Date
	item: IStockItem
	itemId: number
	quantity: number
	weight: number
	notes: number
}

interface IStockReceipt extends IAuditFields {
	date: Date
	number: string
	waybill: string
	supplier: ISupplier
	supplierId: number
	notes: string
	items: IStockReceiptItem[]
}

interface IStockReceiptItem extends IhasId {
	stockReceipt: IStockReceipt
	stockReceiptId: number
	item: IStockItem
	itemId: number
	quantity: number
	gsm: number
	reelWidth: number
}

interface IProduction extends IAuditFields {
	number: number
	startDate: Date
	endDate: Date
	jobOrder: IJobOrder
	jonOrderId: number
	quantityProduced: number
	weightProduced: number
	waste: number
	wasteWeight: number
	materials: IProductionMaterial[]
}

interface IProductionBatch extends IhasId {
	number: number
	start: Date
	end: Date
	notes: string
	production: IProduction
	productionId: number
}

interface IStockIssue extends IAuditFields {
	date: Date
	number: string
	waybill: string
	production: IProduction
	productionId: number
	notes: string
	items: IStockIssueItem[]
}

interface IStockIssueItem extends IhasId {
	stockIssue: IStockIssue
	stockIssueId: number
	item: IStockItem
	itemId: number
	quantity: number
	weight: number
}

interface IContact extends IhasId {
	name: string
	position: string
	email: string
	phoneNumber: string
	customer: ICustomer
	customerId: number
}

interface IProductionMaterial extends IhasId {
	item: IStockItem
	itemId: number
	production: IProduction
	productionId: number
	quantity: number
	reelWidth: number
	reel: { number: number }
	gsm: number
}

interface IMachine extends IhasId {

	name : string
	capacity: number
	notes: string
}

interface ITicket extends IhasId {
    title: string
    description: string
    price: number
    type: string
    status: string
    refPrefix: string
    imageLink: string
    image: string
    admission: number
}

interface ITicketSale extends IhasId {
    ticketId: number
    ticket: ITicket
    refNumber: string
    date: string
    quantity: number
    discount: number
    totalPrice: number
    customerNumber: string
    price: number
    admission: number
}

export {
	ILookUp,
	IUser,
	IRole,
	ICurrency,
	ISupplierCategory,
	ISupplier,
	IFlute,
	IProductType,
	IProductCategory,
	IMaterialType,
	IPaper,
	ICustomer,
	ICustomerCategory,
	IProduct,
	IPaperCombination,
	IJobOrder,
	IJobOrderItem,
	ICustomerProducts,
	IStockItem,
	IStockDiary,
	IStockReceipt,
	IStockReceiptItem,
	IStockIssue,
	IStockIssueItem,
	IProduction,
	IProductionBatch,
	IBadStock,
	IContact,
	IProductionMaterial,
	IMachine,
	ITicket,
	ITicketSale
}
