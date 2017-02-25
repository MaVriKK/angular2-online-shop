import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ManageCenterComponent } from './manage-center';
import { ManageComponent } from './manage';
import { ManageRoutingModule } from './manage.routing.module';

import { ManageProductsComponent } from './products/manage.products';
import { ManageOrdersComponent } from './orders/manage.orders';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ManageRoutingModule
    ],
    declarations: [
        ManageCenterComponent,
        ManageComponent,
        ManageProductsComponent,
        ManageOrdersComponent
    ]
})
export class ManageModule{}