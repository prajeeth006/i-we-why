using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Frontend.Gantry.Shared.Core.Common.RegularExpressions
{
    public interface IRegexForGettingPlaceHolders
    {
        List<string> GetPlaceHolders(string? url);
    }
    public  class RegexForGettingPlaceHolders: IRegexForGettingPlaceHolders
    {
        public  List<string> GetPlaceHolders(string? url)
        {
            List<string> lstPlaceHolders = new List<string>();

            if (url != null)
            {
                string pattern = "{.+?}";
                var matches = from Match match in Regex.Matches(url, pattern)
                    select match;
                foreach (var item in matches)
                {
                    lstPlaceHolders.Add(item.Value);
                }
            }

            return lstPlaceHolders;
        }
    }
}