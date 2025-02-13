import { ScItem } from "../sitecore/sc-models/sc-item.model";

export class StringUtilities {
    static removeNamePrefix(name: string | undefined, searchOption: string = '_'){
      return name ? name.substring(name.indexOf(searchOption) + 1, name.length) : "";
    }

    static removeNamePrefixFromItems(children: ScItem[], searchOption: string = '_'){
      return children.map(scItem => {
        scItem.ItemName = StringUtilities.removeNamePrefix(scItem.ItemName);
        return scItem;
      });
    }
}