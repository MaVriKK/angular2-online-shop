import { Component, OnInit, OnDestroy } from '@angular/core';

import { ManageService } from '../manage.service';
import { ProductService } from '../../product/product.service';
import { Product } from '../../shared/product';
import { ProductOption } from '../../shared/product-option';
import { Dimension } from '../../shared/product-dimension';

@Component({
    selector: "manage-product",
    templateUrl: "./manage.products.html",
    providers: [ManageService, ProductService]
})
export class ManageProductsComponent implements OnInit, OnDestroy {
    public productList: Product[];
    public productResult: any;
    public auth: any;

    constructor(private manageService: ManageService, private productService: ProductService) {
        this.auth = {
            username: "",
            password: "",
            authenticated: false
        }

        this.productResult = {};
    }
    addProduct() {
        this.productList.unshift(new Product(
            (this.productList.length + 1).toString(),
            "Product Name",
            "img Url",
            "details",
            "details long",
            "price range",
            {},
            false
        ));
    }

    removeProduct(index: number, product: Product) {
        this.manageService.removeProduct(product).then(p => {
            if (p.result.deleted == 1)
                this.productList.splice(index, 1);
        })

    }

    addOption(product: Product) {
        console.log("addOption", product);
        var optionKey = product.id + "_" + String(Object.keys(product.options).length);
        product.options[optionKey] = new ProductOption("Name", "Url", {});
    }

    removeOption(key : string, product : Product) {
        delete product.options[key];
    }

    addDimension(optionKey : string, option: ProductOption) {
        var dimKey = optionKey + "_" + String(Object.keys(option.dimensions).length);
        option.dimensions[dimKey] = (new Dimension(dimKey, option.name, "Dimension Specs", 1, 1));
        option.dimensions[dimKey]['optionKey'] = optionKey;
    }

    removeDimension(index: number, dimList: Dimension[]) {
        dimList.splice(index, 1);
    }

    saveProduct(product: Product) {
        console.log('saveProduct.product', product);
        this.manageService.saveProduct(product).then(p => {
            console.log('saveProduct', p);
            this.productResult[product.id] = p.result;
            this.productResult[product.id].date = new Date();
        })
    }

    updateDimensionOptionName(dimensionList: any[], optionName: any) {
        console.log(dimensionList, optionName);
        dimensionList.forEach(e => {
            e.optionName = optionName;
            console.log(e);
        })
    }

    keys(object : any) : Array<String> {
        return Object.keys(object);
    }

    ngOnInit() {
        this.manageService.checkAuth().then(p => {
            if(p.auth == true) {
                this.auth.authenticated = true;
                this.productService.getProductList().then( (productList : Product[]) => {
                    this.productList = productList;
                });
            }
            else 
                this.auth.authenticated = false;
        })
    }

    ngOnDestroy() {

    }
}
