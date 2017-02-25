import { ProductOption } from './product-option';

export class Product { 
    constructor(
        public id: string, 
        public name : string, 
        public imgUrl : string,
        public details : string,
        public detailsLong: string,
        public priceRange: String,
        public options : { [name : string] : ProductOption },
        public isDiscontinued : boolean
    ){}
}
