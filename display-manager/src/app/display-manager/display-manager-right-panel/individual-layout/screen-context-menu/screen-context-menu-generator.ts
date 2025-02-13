import { AssetTypes } from "src/app/common/models/AssetTypes";
import { IndividualScreenMenu } from "./screen-context-menu.model";
import { ContextMenu } from "src/app/common/models/ContextMenu";
import { ScreenInfo } from "../models/individual-gantry-screens.model";


export class IndividualContextMenuGenerator {

    static getRequiredOptions(profileScreen: ScreenInfo | undefined) {

        let preview: IndividualScreenMenu = {
            id: ContextMenu.preview,
            itemName: 'Preview',
            isContentSaved: false,
            data: profileScreen,
        }

        let carouselAdd: IndividualScreenMenu = {
            id: ContextMenu.createCarousel,
            itemName: 'Create Carousel',
            data: profileScreen,
        }

        let carouselEdit: IndividualScreenMenu = {
            id: ContextMenu.editCarousel,
            itemName: 'Edit Carousel',
            isCarouselExists: false,
            data: profileScreen,
        }

        let contextMenuItems: IndividualScreenMenu[] = [];
        
        if (profileScreen?.HasPreview) {

            if (!profileScreen?.NewAssetToSave && !!profileScreen?.NowPlaying) {
                preview.isContentSaved = true;
            }

            contextMenuItems.push(preview);
        }

        if (!profileScreen?.NewAssetToSave && profileScreen?.NowPlaying) {
            contextMenuItems.push(carouselAdd);
            if (profileScreen?.NowPlaying?.AssetType == AssetTypes.Carousel) {
                carouselEdit.isCarouselExists = true;
            }
            contextMenuItems.push(carouselEdit);
        }

        return contextMenuItems;
    }
}