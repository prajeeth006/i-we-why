import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentSection } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnBottomSheet', product: ClientConfigProductName.SF })
@Injectable()
export class BottomSheetConfig extends LazyClientConfigBase {
    menu: MenuContentSection;
}
export function bottomSheetConfigFactory(service: LazyClientConfigService) {
    return service.get(BottomSheetConfig);
}
