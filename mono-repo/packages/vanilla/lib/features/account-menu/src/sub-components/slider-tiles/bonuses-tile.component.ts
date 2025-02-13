import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { OffersService } from '@frontend/vanilla/shared/offers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuTileComponent } from './tile.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuTileComponent, IconCustomComponent],
    selector: 'vn-am-bonuses-tile',
    templateUrl: 'bonuses-tile.html',
})
export class BonusesTileComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    count: number = 0;
    text: string;
    description: string;

    private unsubscribe = new Subject<void>();

    constructor(private offers: OffersService) {
        super();
    }

    ngOnInit() {
        this.text = this.item.resources['NoNewBonusesText']!;
        this.description = this.item.resources['NoNewBonusesDescription']!;
        this.offers.counts.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.count = this.offers.getCount('ALL');
            this.text = this.count ? this.item.resources['NewBonusesText']! : this.item.resources['NoNewBonusesText']!;
            this.description = this.count ? this.item.resources['NewBonusesDescription']! : this.item.resources['NoNewBonusesDescription']!;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
