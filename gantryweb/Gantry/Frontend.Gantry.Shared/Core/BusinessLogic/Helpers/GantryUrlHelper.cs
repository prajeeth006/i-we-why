using Bwin.Vanilla.Core.System.Uris;
using System;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Helpers
{
    public static class GantryUrlHelper
    {
        private const string StaticPromotion = "staticpromotion";

        public static string CreateUrl(
            Uri url, 
            string itemId,
            string componentName = StaticPromotion
            )
        {
            componentName = string.IsNullOrEmpty(componentName) ? StaticPromotion : componentName;

            UriBuilder urlBuilder = new UriBuilder(url);
            urlBuilder = urlBuilder.AppendPathSegment(componentName).AddQueryParameters(("itemIdOrPath", itemId));
            string result = urlBuilder.ToString();

            return result;
        }
    }
}