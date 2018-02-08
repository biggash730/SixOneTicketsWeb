import { IProduct, IPaperCombination, IProductType } from '../schemas/entity_set';
import { ILookUpService, LookUps } from '../settings/lookup_service';
import { IProductService, IProductQuery } from './Productservice';
import { Toast, MessageBox, MessageTypes } from "../helpers/message_box"
import { Routes, AppServices, AngularServices } from '../helpers/config_keys';

let _ = require("underscore")

interface IAppSetting {
    flapPadding: number
}

class ProductFormCtrl {
    //Product Data
    costSetting = <IAppSetting>{}
    title = "New Product";
    newProduct = <IProduct>{ paperCombinations: [] };

    //LookUps
    lookUps = [LookUps.Keys.Customer, LookUps.Keys.ProductType, LookUps.Keys.ProductCategory,
    LookUps.Keys.MaterialType, LookUps.Keys.Flute, LookUps.Keys.CostSetting, LookUps.Keys.Currency]

    //Page Control
    saving: boolean;
    loading: boolean;
    deleting: boolean;
    printing: boolean

    static $inject = [AngularServices.Scope, AngularServices.State, AngularServices.StateParams, AppServices.LookUpService, AppServices.ProductService];

    constructor(private $scope: angular.IScope,
        private $state: angular.ui.IStateService,
        private $stateParams: angular.ui.IStateParamsService,
        private lookUpService: ILookUpService,
        private productService: IProductService) {
        this.start()
    }

    show() {
        console.log(this.newProduct.paperCombinations);

    }

    setPaperCombinations() {
        if (!this.newProduct.type) return
        this.newProduct.paperCombinations = this.newProduct.type.papers.map((paper) => {
            return <IPaperCombination>{ paperId: paper.id, paper: paper, quantity: 0 }
        })
    }

    calculate() {
        this.newProduct.boardLength = (this.newProduct.category.equalProductAndBoardDimension) ? this.newProduct.length : ((this.newProduct.length * 2) + (this.newProduct.width * 2) + this.costSetting.flapPadding);
        this.newProduct.boardWidth = (this.newProduct.category.equalProductAndBoardDimension) ? this.newProduct.width : (this.newProduct.width + this.newProduct.height) + this.newProduct.type.boardWidthRate;
        this.newProduct.boardLengthWithoutFlap = this.newProduct.boardLength - (this.costSetting.flapPadding / 1000);
        this.newProduct.gsm = 0
        this.newProduct.amount = 0
        this.newProduct.paperCombinations.forEach((combination) => {
            //Sum up paper quantities to get GSM
            let paperGsm = combination.quantity;
            if (combination.paper.flute) paperGsm = paperGsm * combination.paper.flute.rate
            this.newProduct.gsm += paperGsm

            //Sum up paper material prices            
            if (combination.materialType && combination.quantity > 0) this.newProduct.amount += combination.materialType.price
        })

        this.newProduct.boardWeight = ((this.newProduct.boardWidth * this.newProduct.boardLength) / 1000000) * this.newProduct.gsm
        this.newProduct.outWidth = this.newProduct.boardWidth * this.newProduct.numberOfOuts
        this.newProduct.trim = this.newProduct.reelWidth - this.newProduct.outWidth
        this.newProduct.waste = (this.newProduct.trim / this.newProduct.reelWidth) * 100
        this.newProduct.totalBoardWeight = this.newProduct.boardWeight + (this.newProduct.boardWeight * (this.newProduct.waste / 100))

        //Calculate Price
        let convertedAmount = this.newProduct.amount / this.newProduct.type.priceConversionRate
        let boardPrice = convertedAmount * this.newProduct.totalBoardWeight

        //Calculate Die Cost
        let totalDieCost = 0;
        if (this.newProduct.category.includesDie) {
            totalDieCost = this.newProduct.dieCost + (this.newProduct.dieCost * this.newProduct.clearingCostPercentage)
            boardPrice += totalDieCost / this.newProduct.projectedQuantity
        }

        //Get Number of Products Per Board.
        let productsPerBoard = (this.newProduct.category.multipleOutsPerBoard) ? this.newProduct.outsPerBoard : 1;

        //Set Price
        this.newProduct.price = boardPrice / productsPerBoard
    }

    save() {
        let theProduct = angular.copy(this.newProduct)
        theProduct.typeId = theProduct.type.id
        theProduct.categoryId = theProduct.category.id
        delete theProduct.type
        delete theProduct.category
        delete theProduct.customer
        delete theProduct.materialType
        delete theProduct.category
        theProduct.paperCombinations = theProduct.paperCombinations.map((combination) => {
            combination.paperId = combination.paper.id
            if (combination.materialType) combination.materialTypeId = combination.materialType.id
            delete combination.paper
            delete combination.materialType
            return combination
        })
        this.saving = true
        this.productService.save(theProduct).then((res) => {
            this.saving = false
            if (res.success) this.$state.go(Routes.Products)
        })
    }

    delete() {
        MessageBox.confirm("Delete Product", `Are you sure you want to delete ${this.newProduct.name}?`).then((yes) => {
            if (yes) {
                this.deleting = true
                this.productService.delete(this.newProduct.id).then((res) => {
                    this.deleting = false
                    if (res.success) { this.$state.go(Routes.Products) }
                })
            }
        })
    }

    private fetchProduct(id: number) {
        this.loading = true
        this.productService.find(id).then((res) => {
            this.loading = false
            if (res.success) {
                this.newProduct = angular.copy(res.data)
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

    private start() {
        this.loadLookUps()
        let id = this.$stateParams['id']
        if (id) {
            //Edit Product Information
            this.title = "Edit Product"
            this.fetchProduct(id)
        } else {
            //Creating New Product
            this.title = "New Product"
            this.newProduct = <IProduct>{
                paperCombinations: [], length: 0,
                width: 0, height: 0, profit: 0,
                numberOfOuts: 2, reelWidth: 0
            }
        }
    }
}

export { ProductFormCtrl }