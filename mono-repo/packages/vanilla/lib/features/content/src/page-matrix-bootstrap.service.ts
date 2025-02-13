import { Injectable } from '@angular/core';

import { PageMatrixService as CorePageMatrixService, EmbeddableComponentsService, OnFeatureInit } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import * as pc2 from './components-v2/pc.components';
import { ContentFilterComponent } from './content-filter.component';
import { PageMatrixService } from './page-matrix.service';

@Injectable()
export class PageMatrixBootstrapService implements OnFeatureInit {
    constructor(
        private pageMatrixService: PageMatrixService,
        private corePageMatrixService: CorePageMatrixService,
        private embeddableComponentsService: EmbeddableComponentsService,
    ) {}

    onFeatureInit() {
        this.embeddableComponentsService.registerEmbeddableComponent(IconCustomComponent, 100);
        this.embeddableComponentsService.registerEmbeddableComponent(ContentFilterComponent, 100);
        this.pageMatrixService.registerComponent('pm1colpage', pc2.PM1ColPageComponent);
        this.pageMatrixService.registerComponent('pctext', pc2.PCTextComponent);
        this.pageMatrixService.registerComponent('pc-text-with-header-bar', pc2.PCTextWithHeaderBarComponent);
        this.pageMatrixService.registerComponent('pc-header-for-mpp-page', pc2.PCHeaderForMppPageComponent);
        this.pageMatrixService.registerComponent('pcimage', pc2.PCImageComponent);
        this.pageMatrixService.registerComponent('pcimagetext', pc2.PCImageTextComponent);
        this.pageMatrixService.registerComponent('pc teaser', pc2.PCTeaserComponent);
        this.pageMatrixService.registerComponent('pccomponentfolder', pc2.PCComponentFolderComponent);
        this.pageMatrixService.registerComponent('pcregionalcomponent', pc2.PCRegionalComponent);
        this.pageMatrixService.registerComponent('pccontainer', pc2.PCContainerComponent);
        this.pageMatrixService.registerComponent('pc-toggle', pc2.PCToggleComponent);
        this.pageMatrixService.registerComponent('pc menu', pc2.PCMenuComponent);
        this.pageMatrixService.registerComponent('rawimage', pc2.PCRawImageComponent);
        this.pageMatrixService.registerComponent('rawtext', pc2.PCRawTextComponent);
        this.pageMatrixService.registerComponent('pccarousel', pc2.PCCarouselComponent);
        this.pageMatrixService.registerComponent('pcvideo', pc2.PCVideoComponent);
        this.pageMatrixService.registerComponent('pcscrollmenu', pc2.PCScrollMenuComponent);

        this.corePageMatrixService.set(this.pageMatrixService);
    }
}
