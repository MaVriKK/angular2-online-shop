import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageRoutingModule } from './manage/manage.routing.module';

import { cartRoutes } from './cart/cart.routes';
import { subscribeRoutes } from './subscribe/subscribe.routes';

import { HomeComponent } from './home/home';
import { CartComponent } from './cart/cart';
import { SubscribeComponent } from './subscribe/subscribe';
import { ProductComponent } from './product/product';
import { ThankYouComponent } from './thankyou/thankyou';
import { ManageComponent } from './manage/manage';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'product/:id', component: ProductComponent},
            {path: 'cart', component: CartComponent},
            {path: 'subscribe', component: SubscribeComponent},
            {path: 'thankyou/:paymentId', component: ThankYouComponent},
            //{path: 'manage', component: ManageComponent}
            //{path: 'manage', loadChildren: 'app/manage/manage.module#ManageModule'}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}