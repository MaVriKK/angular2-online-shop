import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageCenterComponent } from './manage-center';
import { ManageComponent } from './manage';
import { ManageProductsComponent } from './products/manage.products';
import { ManageOrdersComponent } from './orders/manage.orders';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                redirectTo: '/manage',
                pathMatch: 'full'
            },
            {
                path: 'manage',
                component: ManageCenterComponent,
                children: [
                    {
                        path: '',
                        component: ManageComponent
                    },
                    {
                        path: 'products',
                        component: ManageProductsComponent
                    },
                    {
                        path: 'orders',
                        component: ManageOrdersComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ManageRoutingModule {}