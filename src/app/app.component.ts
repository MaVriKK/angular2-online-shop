import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <nav class="grey darken-4">
            <div class="nav-wrapper">
                <a routerLink="/" class="brand-logo center hide-on-small-only">
                    <img height="60px" src="assets/imgs/assets/Banner/01_transparent_banner_white_sm.png"/>
                </a>
                <a routerLink="/" class="brand-logo left hide-on-med-and-up">
                    <img height="60px" src="assets/imgs/assets/Banner/01_transparent_banner_white_sm.png"/>
                </a>
                <ul class="right">
                    <li><a routerLink="/" routerLinkActive="active">Home</a></li>
                    <li><a routerLink="/subscribe" routerLinkActive="active">Subscribe</a></li>
                    <li>
                        <a routerLink="/cart" routerLinkActive="active">
                            <div class="cart-badge">
                                <span class="left" id="cartCount"></span>
                                <i class="tiny material-icons">shopping_cart</i>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <router-outlet></router-outlet>
    `
})
export class AppComponent { }
