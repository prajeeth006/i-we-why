import { AssetTypes } from "src/app/common/models/AssetTypes";
import { ProfileScreen } from "../../profiles/models/profile";
import { MenuItem } from "./screen-context-menu.model";
import { ContextMenu } from "src/app/common/models/ContextMenu";
import { TreeNode } from "src/app/display-manager/display-manager-left-panel/tree-view/models/tree-node.model";


export class ContextMenuGenerator {

    static getRequiredOptions(profileScreen: ProfileScreen) {
        let preview: MenuItem = {
            id: ContextMenu.preview,
            itemName: 'Preview',
            isContentSaved: false,
        }

        let carouselAdd: MenuItem = {
            id: ContextMenu.createCarousel,
            itemName: 'Create Carousel',
        }

        let carouselEdit: MenuItem = {
            id: ContextMenu.editCarousel,
            itemName: 'Edit Carousel',
            isCarouselExists: false
        }

        let shiftAsset: MenuItem = {
            id: ContextMenu.removeAndShiftAssetsLeft,
            itemName: 'Remove content & shift assets left',
        }
        let splitCarouselNone: boolean = true;

        let contextMenuItems: MenuItem[] = [];

        if(profileScreen?.NowPlaying?.Asset?.event?.racingAssetType?.includes('ScreenSplit') || profileScreen?.NowPlaying?.Asset?.event?.assetType?.includes('ScreenSplit')) {
            splitCarouselNone = false;
          }

        if (profileScreen?.DisplayScreen?.HasPreview) {

            if (!!profileScreen?.IsContentSaved && !!profileScreen?.NowPlaying?.Asset?.ruleId) {
                preview.isContentSaved = true;
            }

            contextMenuItems.push(preview);
        }

        if (profileScreen?.DisplayScreen?.HasCarousel && splitCarouselNone) {
            let assetType: any
            contextMenuItems.push(carouselAdd);
            if (!!profileScreen?.NowPlaying?.Asset) {
                assetType = profileScreen?.NowPlaying?.Asset;
            }
            if (profileScreen?.NowPlaying?.ScreenRuleRequest?.assetType?.toLowerCase() == AssetTypes.Carousel.toLowerCase() ||
                assetType?.assetType?.toLowerCase() == AssetTypes.Carousel.toLowerCase()) {
                carouselEdit.isCarouselExists = true;
            }
            contextMenuItems.push(carouselEdit);
        }

        if (profileScreen?.DisplayScreen?.HasShiftAsset) {
            contextMenuItems.push(shiftAsset);
        }

        return contextMenuItems;
    }
}