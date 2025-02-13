import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { CarouselContentService } from './carousel-content.service';
import { CarouselService } from '../tree-view/services/carousel-service/carousel.service';
import { ScreenRuleRequest } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model';
import { FieldError } from 'src/app/common/form-validion/validation.model';
import { FormValidationService } from 'src/app/common/form-validion/form-validation.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeOptions, NodeProperties, TreeNode } from '../tree-view/models/tree-node.model';
import { StringUtilities } from 'src/app/helpers/string-utilities';
import { MainTreeNode } from '../tree-view/models/main-tree-node.model';
import { Carousel } from './models/carousel';
import { AssetDesignService } from 'src/app/display-manager/display-manager-right-panel/services/AssetDesignService/asset-design.service';
import { CommonService } from '../tree-view/services/common-service/common.service';
import { PresentAsset } from 'src/app/display-manager/display-manager-right-panel/profiles/models/profile';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { SitecoreImageService } from '../services/sitecore-image/sitecore-image.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  nameValidPattern = "^[a-zA-Z0-9 ]{1,30}$";
  carouselDrop: string = 'carouselDrop';
  carouselMinDuration: number = 10;
  carouselPrefillDuration: number = 20;
  carouselMaxDuration: number = 120;
  minCarouselItems: number = 2;
  maxCarouselItems: number = 20;
  isSaveInProgress: boolean = false;
  hamburgerIconPath: string | undefined;

  carouselForm: UntypedFormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.compose([Validators.required,
    Validators.maxLength(this.carouselMaxDuration),
    Validators.pattern(this.nameValidPattern)])],
    items: this.fb.array([Validators.minLength(this.minCarouselItems)])
  });

  currentLabel: string;
  totalDuration: number = 0;
  totalErrors: number = 0;
  treeNode?: any;
  openStatus?: boolean = false;
  hasMinTimeErrors: boolean = false;
  hasMaxTimeErrors: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) treeNode: TreeNode,
    private fb: UntypedFormBuilder,
    public carouselContentService: CarouselContentService,
    public carouselService: CarouselService,
    private commonService: CommonService,
    private assetDesignService: AssetDesignService,
    public formValidationService: FormValidationService,
    public labelSelectorService: LabelSelectorService,
    private dialogRef: MatDialog,
    private sitecoreImageService: SitecoreImageService
  ) {
    this.treeNode = treeNode;
  }

  ngOnInit(): void {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.hamburgerIconPath = mediaAssets?.HamburgerIcon;
    })

    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.currentLabel = currentLabel.toLowerCase();

      if (this.openStatus == true) {
        this.closePopup();
      }
      this.openStatus = true;
    });

    this.carouselForm = this.fb.group({
      id: [null],
      name: ['', Validators.compose([Validators.required, Validators.pattern(this.nameValidPattern)])],
      items: this.fb.array([], [Validators.minLength(this.minCarouselItems)])
    });

    this.carouselForm.valueChanges.subscribe(() => {
      this.listOutErrors();
    });


    if (this.treeNode) {
      this.editCarousel();
    }
    else {
      let assets: any = this.carouselService.screenForCarouselData?.NowPlaying?.Asset;
      if (this.carouselService.screenForCarouselData?.NowPlaying?.ScreenRuleRequest) {
        if (!!this.carouselService.screenForCarouselData?.NowPlaying?.ScreenRuleRequest?.assetType && this.carouselService.screenForCarouselData?.NowPlaying?.ScreenRuleRequest?.assetType != AssetTypes.Carousel) {
          let screenRuleRequest = this.carouselService.screenForCarouselData?.NowPlaying?.ScreenRuleRequest;

          const { isPromotionTreeNode, isChannelTreeNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink, assetType, isMisc, targetItemID, isManualTreeNode, isCarouselTreeNode, targetItemName } = screenRuleRequest;

          let treeNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
          let nodeProps: NodeProperties = {
            id: targetItemID as string, name: StringUtilities.removeNamePrefix(targetItemName), level: 0, isFolder: false, expandable: false, isPromotionTreeNode, isChannelTreeNode, isCarousleNode: isCarouselTreeNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink, assetType, eventList: undefined, isMisc, targetId: targetItemID, isManualTreeNode
          }
          let nodeOptions: NodeOptions = { needDeleteIcon: false, needEditIcon: false }

          treeNode = new MainTreeNode(nodeProps, nodeOptions)

          treeNode.event = screenRuleRequest.racingEvent;
          this.getCarousel.push(this.addCarouselItem(treeNode, screenRuleRequest.ruleId));
        }
      } else if (!!assets?.assetType && assets?.assetType != AssetTypes.Carousel) {
        let asset: any = this.carouselService.screenForCarouselData?.NowPlaying?.Asset;

        const { id, name, isPromotionTreeNode, isChannelTreeNode, isCarousleNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink, targetId, isMisc, isManualTreeNode, assetType, contentMediaType, tradingPartitionId, contentProvider } = asset;

        let treeNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
        let nodeProps: NodeProperties = { id, name: StringUtilities.removeNamePrefix(name), level: 0, isFolder: false, expandable: false, isPromotionTreeNode, isChannelTreeNode, isCarousleNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink, assetType, eventList: undefined, isMisc, targetId, isManualTreeNode, contentMediaType, tradingPartitionId, contentProvider }

        let nodeOptions: NodeOptions = { needDeleteIcon: false, needEditIcon: false }

        treeNode = new MainTreeNode(nodeProps, nodeOptions)

        treeNode.event = asset?.event;
        this.getCarousel.push(this.addCarouselItem(treeNode, asset?.ruleId));
      }
    }
  }

  get getCarousel(): UntypedFormArray {
    return this.carouselForm.get('items') as UntypedFormArray;
  }

  get getCarouselActiveItems() {
    let carouselItems = this.getCarousel.value;
    return carouselItems.filter((rule: ScreenRuleRequest) => !rule.isDeleted);
  }

  addNewCarouselItem($event: any) {
     if(!$event?.event?.splitScreen?.splitScreenTotalPages) {
    let index = this.getCarousel.value.findIndex((a: any) => {
      return a.isDeleted == true;
    });
    if (index < 1)
      this.getCarousel.push(this.addCarouselItem($event))
    else
      this.getCarousel.insert(index, this.addCarouselItem($event))
     }
  }

  addCarouselItem(droppedItem: MainTreeNode, ruleId: string | undefined = undefined, carouselduration: number = this.carouselPrefillDuration): UntypedFormGroup {
    let asset: ScreenRuleRequest = PrepareScreenRuleRequest.createRuleRequest(this.labelSelectorService.getCurrentLabel(), '', droppedItem, '', false)

    let nowPlayingItem: PresentAsset = {
      Name: droppedItem?.nodeProperties?.name,
      ScreenRuleRequest: asset
    }

    if (droppedItem.event && (droppedItem?.event?.id != "0" || droppedItem.event?.typeId != 0)) {
      return this.fb.group({
        assetName: nowPlayingItem,
        asset: this.assetDesignService.getAssetImageForDroppedItem(droppedItem),
        assetType: droppedItem?.nodeProperties?.assetType,
        ruleId: ruleId,
        label: this.currentLabel,
        targetItemID: droppedItem?.nodeProperties?.id,
        targetLink: droppedItem?.nodeProperties?.targetLink,
        targetItemName: droppedItem?.nodeProperties?.name,
        racingEvent: droppedItem.event,
        isDeleted: false,
        carouselDuration: [carouselduration,
          Validators.compose([Validators.required,
          Validators.min(this.carouselMinDuration),
          Validators.max(this.carouselMaxDuration)])],
      })
    } else {
      return this.fb.group({
        assetName: nowPlayingItem,
        asset: this.assetDesignService.getAssetImageForDroppedItem(droppedItem),
        assetType: droppedItem?.nodeProperties?.assetType,
        ruleId: ruleId,
        label: this.currentLabel,
        targetItemID: droppedItem?.nodeProperties?.isManualTreeNode == true ? droppedItem?.nodeProperties?.targetId : droppedItem?.nodeProperties?.id,
        targetLink: droppedItem?.nodeProperties?.targetLink,
        targetItemName: droppedItem?.nodeProperties?.name,
        isPromotionTreeNode: droppedItem?.nodeProperties?.isPromotionTreeNode,
        isMultiEventTreeNode: droppedItem?.nodeProperties?.isMultiEventTreeNode,
        isChannelTreeNode: droppedItem?.nodeProperties?.isChannelTreeNode,
        isMisc: droppedItem?.nodeProperties?.isMisc,
        contentItemId: droppedItem?.nodeProperties?.isManualTreeNode == true ? droppedItem?.nodeProperties?.id : '',
        isManualTreeNode: droppedItem?.nodeProperties?.isManualTreeNode,
        isDeleted: false,
        carouselDuration: [carouselduration, Validators.compose([
          Validators.required,
          Validators.min(this.carouselMinDuration),
          Validators.max(this.carouselMaxDuration)])],
      })
    }

  }

  editCarousel() {
    let carouselId = (!!this.treeNode?.nodeProperties) ? this.treeNode?.nodeProperties?.id : this.treeNode.id;
    this.carouselContentService.getCarouselRules(carouselId).subscribe((carousel: Carousel) => {
      this.carouselForm.get('id')?.patchValue(carousel.Id);
      this.carouselForm.get('name')?.patchValue(StringUtilities.removeNamePrefix(carousel.Name));
      carousel.GantryTargetingRules.forEach(carouselItem => {

        const { ruleId, targetItemName, isPromotionTreeNode, isChannelTreeNode, isCarouselTreeNode, isMultiEventTreeNode, assetType, isSkyChannelTreeNode, isMisc, targetItemID, isManualTreeNode } = carouselItem;

        let treeNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
        let nodeProps: NodeProperties = { id: ruleId, name: StringUtilities.removeNamePrefix(targetItemName), level: 0, isFolder: false, expandable: false, isPromotionTreeNode, isChannelTreeNode, isCarousleNode: isCarouselTreeNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink: '', assetType, eventList: undefined, isMisc, targetId: targetItemID, isManualTreeNode }

        let nodeOptions: NodeOptions = { needDeleteIcon: false, needEditIcon: false }


        treeNode = new MainTreeNode(nodeProps, nodeOptions)

        treeNode.event = carouselItem.racingEvent;
        this.getCarousel.push(this.addCarouselItem(treeNode, carouselItem.ruleId, carouselItem.carouselDuration));
      });
    });
  }

  deleteCarouselItem(index: number) {
    if ((this.getCarousel.at(index) as UntypedFormGroup).get('ruleId')?.value) {
      (this.getCarousel.at(index) as UntypedFormGroup).get('isDeleted')?.patchValue(true);
      (this.getCarousel.at(index) as UntypedFormGroup).get('carouselDuration')?.patchValue(this.carouselMinDuration);
      this.moveItemInFormArray(this.getCarousel, index, this.getCarousel.controls.length);
    } else {
      this.getCarousel.removeAt(index);
    }
  }

  orderCarouselItems(event: CdkDragDrop<string[]>) {
    this.moveItemInFormArray(this.getCarousel, event.previousIndex, event.currentIndex);
  }

  moveItemInFormArray(formArray: UntypedFormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);

    if (from === to) {
      return;
    }

    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  }

  /** Clamps a number between zero and a maximum. */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

  listOutErrors() {
    this.totalDuration = 0;
    this.carouselForm?.value.items.map((rule: ScreenRuleRequest) => {
      if (!rule.isDeleted)
        this.totalDuration += rule?.carouselDuration ? parseInt(rule?.carouselDuration?.toString()) : 0;
    })
    let errors: FieldError[] = [];
    this.formValidationService?.getFormErrors(this.carouselForm, '', '', errors);
    this.totalErrors = errors.length;
    this.hasMinTimeErrors = errors.filter(x => x.fieldName == 'carouselDuration' && x.errorCode != 'max')?.length > 0;
    this.hasMaxTimeErrors = errors.filter(x => x.fieldName == 'carouselDuration' && x.errorCode == 'max')?.length > 0;
  }

  onSubmit(): void {
    if (this.carouselForm.valid && this.getCarouselActiveItems.length <= this.maxCarouselItems) {
      this.isSaveInProgress = true;
      this.carouselContentService.createCaruouselRule(this.carouselForm.value.id, this.carouselForm.value.name, this.carouselForm.value.items)
        .subscribe((carouselId: Carousel) => {
          this.carouselService.setCarouselPopupClose(carouselId);
          this.dialogRef.closeAll();
        }, error => {
          console.error(error);
          this.isSaveInProgress = false;
        });
    }
  }

  closePopup() {
    this.carouselService.setCarouselPopupClose(undefined);
    this.dialogRef.closeAll();
  }

}
