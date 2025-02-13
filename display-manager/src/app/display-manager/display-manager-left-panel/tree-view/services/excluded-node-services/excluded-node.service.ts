import { Injectable } from '@angular/core';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { MainTreeNode } from '../../models/main-tree-node.model';
import * as xml2js from 'xml2js';
import { ConfigItem, CookieData, ExcludeConfig, ExcludingTypes } from '../../models/excluded-model';
import { Settings } from '../../../../../common/models/key-value-config';
import { HttpParams } from '@angular/common/http';
import { IncludeExcludeNodeService } from '../include-exclude-node/include-exclude-node.service';
import { Observable } from 'rxjs';
import { NodeHideShow } from '../../models/node-hide-show';




@Injectable({
  providedIn: 'root'
})
export class ExcludedNodeService {

  parseString: (str: xml2js.convertableToString, cb: any) => void;
  constructor(
    private labelSelectorService: LabelSelectorService,
    private scItemService: ScItemService,
    private includeExcludeNodeService: IncludeExcludeNodeService,
  ) {

    this.parseString = new xml2js.Parser({ ignoreAttrs: false, mergeAttrs: true, charkey: 'value' }).parseString;
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {

      this.getSharedExcludedNodes(currentLabel);

      let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/Next15/ExcludedList');
      this.scItemService.getDataFromMasterDB<any>('/sitecore/api/ssc/item', queryParams)
        .subscribe((exludedItems: ExcludeConfig) => {
          this.loadConfigValues(exludedItems);
        });

      let deleteQueryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/DeleteAsset/DeleteList');
      this.scItemService.getDataFromMasterDB<any>('/sitecore/api/ssc/item', deleteQueryParams)
        .subscribe((exludedItems: ExcludeConfig) => {
          this.loadDeleteConfigValues(exludedItems);
        });

      let editQueryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/EditAsset/EditList');
      this.scItemService.getDataFromMasterDB<any>('/sitecore/api/ssc/item', editQueryParams)
        .subscribe((exludedItems: ExcludeConfig) => {
          this.loadEditConfigValues(exludedItems);
        });



      let overrideQueryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/OverrideAsset/OverrideList');
      this.scItemService.getDataFromMasterDB<any>('/sitecore/api/ssc/item', overrideQueryParams)
        .subscribe((exludedItems: ExcludeConfig) => {
          this.loadOverrideConfigValues(exludedItems);
        });

    })

  }

  excludedNode: { [key: string]: any } = {};
  excludedPaths: Array<Array<string>> = [];
  deletePaths: Array<Array<string>> = [];
  editPaths: Array<Array<string>> = [];
  overridePaths: Array<Array<string>> = [];
  overrideMarkets: Array<string> = [];
  sportsbookApiUrl: string = "";
  racingContentApiUrl: string = "";
  snapshotTimeOut: number = 5000;

  cookieTitle = "next15ExcludedItems";

  addEditExcludedNode(currentLabel: string, node: MainTreeNode, parentList: Array<string | undefined>) {
    return new Observable(subscriber => {
      try {
        if (parentList?.length > 0) {
          let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
          if (typeOfExclude) {
            node.nodeOptions.isExcluded = !node?.nodeOptions?.isExcluded;
            let excludeValue = this.getNodeValue(typeOfExclude, node);

            let nodeDataHideShow = new NodeHideShow();
            nodeDataHideShow.currentLabel = currentLabel;
            nodeDataHideShow.category = parentList[0] as string;
            nodeDataHideShow.type = typeOfExclude;
            nodeDataHideShow.excludeValue = excludeValue as string;
            nodeDataHideShow.isExclude = node?.nodeOptions?.isExcluded;
            this.includeExcludeNodeService.setIncludeExcludeNodeData(nodeDataHideShow).subscribe((data) => {
              try {
                if (data)
                  this.excludedNode = JSON.parse(data);
              } catch (e) { }
              subscriber.next()
              subscriber.complete()
            })
          } else {
            subscriber.next()
            subscriber.complete()
          }
        } else {
          subscriber.next()
          subscriber.complete()
        }
      } catch (e) {
        subscriber.next()
        subscriber.complete()
      }
    })
  }

  hasToShowIcon(parentList: Array<string | undefined>, node: MainTreeNode) {
    let parentListNodes = [...parentList];

    let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
    let excludeValue = this.getNodeValue(typeOfExclude, node);

    if (excludeValue)
      parentListNodes.push(excludeValue);
    let hasToShow = this.excludedPaths.some(parentNodes =>
      parentListNodes.every((node, i) => parentListNodes.length === parentNodes.length &&
        node && (new RegExp(parentNodes[i], 'i')).test(node)
      ));
    return hasToShow
  }

  hasToShowDeleteIcon(parentList: Array<string | undefined>, node: MainTreeNode) {
    let parentListNodes = [...parentList];

    let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
    let excludeValue = this.getNodeValue(typeOfExclude, node);

    if (excludeValue)
      parentListNodes.push(excludeValue);
    let hasToShow = this.deletePaths.some(parentNodes =>
      parentListNodes.every((node, i) => parentListNodes.length === parentNodes.length &&
        node && (new RegExp(parentNodes[i], 'i')).test(node)
      ));
    return hasToShow
  }

  hasToShowEditIcon(parentList: Array<string | undefined>, node: MainTreeNode) {
    let parentListNodes = [...parentList];

    let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
    let excludeValue = this.getNodeValue(typeOfExclude, node);

    if (excludeValue)
      parentListNodes.push(excludeValue);
    let hasToShow = this.editPaths.some(parentNodes =>
      parentListNodes.every((node, i) => parentListNodes.length === parentNodes.length &&
        node && (new RegExp(parentNodes[i], 'i')).test(node)
      ));
    return hasToShow
  }

  hasToShowOverrideIcon(parentList: Array<string | undefined>, node: MainTreeNode) {
    let parentListNodes = [...parentList];

    let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
    let excludeValue = this.getNodeValue(typeOfExclude, node);

    if (excludeValue)
      parentListNodes.push(excludeValue);
    let hasToShow = this.overridePaths.some(parentNodes =>
      parentListNodes.every((node, i) => parentListNodes.length === parentNodes.length &&
        node && (new RegExp(parentNodes[i], 'i')).test(node)
      ));

    if (hasToShow) {
      hasToShow = (!!node?.event?.marketsWhichAreDropped && this.overrideMarkets.includes(node?.event?.marketsWhichAreDropped?.toLowerCase())) ?? false
    }
    return hasToShow
  }

  isNodeExcluded(currentLabel: string, node: MainTreeNode, parentList: Array<string | undefined>) {
    try {
      if (parentList?.length < 1)
        return false

      if (!this.hasToShowIcon(parentList, node))
        return false;

      let typeOfExclude: ExcludingTypes | undefined = this.getNodeType(node);
      if (!typeOfExclude)
        return false;

      let cookieData: CookieData = this.getExcludedNodesFromCookie(currentLabel, parentList[0]);
      let cookieArray = cookieData[typeOfExclude] == undefined ? [] : cookieData[typeOfExclude]?.split('|') ?? [];

      let excludeValue = this.getNodeValue(typeOfExclude, node);
      let index = cookieArray.findIndex(x => x == excludeValue)
      return index > -1
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  getExcludedNodesList(currentLabel: string, typeOfExclude: ExcludingTypes, parentList: Array<string | undefined>) {
    try {
      if (parentList?.length < 1)
        return "";

      if (!typeOfExclude)
        return "";
      let cookieData: CookieData = this.getExcludedNodesFromCookie(currentLabel, parentList[0]);
      let cookieArray = cookieData[typeOfExclude] == undefined ? [] : cookieData[typeOfExclude]?.split('|') ?? [];
      return cookieArray.join(',');
    } catch (e) {
      console.error(e);
    }

    return "";
  }

  getExcludedNodesFromCookie(currentLabel: string, type: string | undefined) {
    if (type && this.excludedNode) {
      var keys = Object.keys(this.excludedNode);
      if (keys?.length > 0 && this.excludedNode[keys[0]][type])
        return this.excludedNode[keys[0]][type]
    }
    return {};
  }

  loadConfigValues(configData: ExcludeConfig) {
    this.parseString(configData?.Settings,
      (_err: any, settings: Settings) => {
        let entry = settings?.bwinnamevalue?.entry;
        let excludedPreparedPaths: Array<Array<string>> = [];
        if (entry?.length) {
          let configItem: ConfigItem = entry.reduce((obj: any, item: any) => (obj[item?.key] = item?.value, obj), {});
          let paths = configItem.ExcludedPaths?.split("||");
          paths.forEach(path => {
            excludedPreparedPaths.push(path.split('|'));
          });
          this.excludedPaths = excludedPreparedPaths;
        }
      });

  }

  loadDeleteConfigValues(configData: ExcludeConfig) {
    this.parseString(configData?.Settings,
      (_err: any, settings: Settings) => {
        let entry = settings?.bwinnamevalue?.entry;
        let excludedPreparedPaths: Array<Array<string>> = [];
        if (entry?.length) {
          let configItem: ConfigItem = entry.reduce((obj: any, item: any) => (obj[item?.key] = item?.value, obj), {});
          let paths = configItem.DeletePaths?.split("||");
          paths.forEach(path => {
            excludedPreparedPaths.push(path.split('|'));
          });
          this.deletePaths = excludedPreparedPaths;
        }
      });
  }

  loadEditConfigValues(configData: ExcludeConfig) {
    this.parseString(configData?.Settings,
      (_err: any, settings: Settings) => {
        let entry = settings?.bwinnamevalue?.entry;
        let excludedPreparedPaths: Array<Array<string>> = [];
        if (entry?.length) {
          let configItem: ConfigItem = entry.reduce((obj: any, item: any) => (obj[item?.key] = item?.value, obj), {});
          let paths = configItem.EditPaths?.split("||");
          paths.forEach(path => {
            excludedPreparedPaths.push(path.split('|'));
          });
          this.editPaths = excludedPreparedPaths;
        }
      });
  }


  loadOverrideConfigValues(configData: ExcludeConfig) {
    this.parseString(configData?.Settings,
      (_err: any, settings: Settings) => {
        let entry = settings?.bwinnamevalue?.entry;
        let editPreparedPaths: Array<Array<string>> = [];
        let overrideMarkets: Array<Array<string>> = [];
        if (entry?.length) {
          let configItem: ConfigItem = entry.reduce((obj: any, item: any) => (obj[item?.key] = item?.value, obj), {});
          let paths = configItem.OverridePaths?.split("||");
          paths.forEach(path => {
            editPreparedPaths.push(path.split('|'));
          });
          this.overridePaths = editPreparedPaths;
          this.overrideMarkets = configItem.OverrideMarkets?.toLowerCase()?.split("|");
          this.sportsbookApiUrl = configItem.EventFeedApi;
          this.racingContentApiUrl = configItem.EventFeedRacingContentApi;
          this.snapshotTimeOut = configItem.SnapshotTimeOut;
        }
      });

  }

  getNodeType(node: MainTreeNode): ExcludingTypes | undefined {
    let typeOfExclude: ExcludingTypes | undefined = undefined;
    if (node.event?.eventName) {
      typeOfExclude = ExcludingTypes.Event;
    } else if (node.event?.typeName) {
      typeOfExclude = ExcludingTypes.Type;
    } else if (node.event?.className) {
      typeOfExclude = ExcludingTypes.Class;
    } else if (node.event?.categoryCode) {
      typeOfExclude = ExcludingTypes.Category;
    }

    return typeOfExclude;
  }


  getNodeValue(excludingType: ExcludingTypes | undefined, node: MainTreeNode) {
    let excludeValue: string | undefined;
    if (excludingType == ExcludingTypes.Event) {
      excludeValue = node?.event?.id;
    } else if (excludingType == ExcludingTypes.Type) {
      excludeValue = node?.nodeProperties?.name;
    } else if (excludingType == ExcludingTypes.Class) {
      excludeValue = node?.nodeProperties?.name;
    } else if (excludingType == ExcludingTypes.Category) {
      excludeValue = node?.nodeProperties?.name;
    } else {
      excludeValue = node?.nodeProperties?.name;
    }

    return excludeValue;
  }

  getSharedExcludedNodes(currentLabel: string) {
    this.includeExcludeNodeService.getIncludeExcludeNodeData(currentLabel).subscribe((data: string) => {
      try {
        if (data)
          this.excludedNode = JSON.parse(data);
      } catch (e) { }
    })
  }

}
