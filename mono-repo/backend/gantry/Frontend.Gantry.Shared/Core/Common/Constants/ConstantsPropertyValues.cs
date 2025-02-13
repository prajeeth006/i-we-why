using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Common.Constants
{
    public static class ConstantsPropertyValues
    {
        public const string Star = "*";
        public const string TraceIdCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxy0123456789-=";
        public const string RtmsPresenceMessageDeviceId = "rdisp";
        public const string RtmAppConnect = "RTM_APP_CONNECT";
        public const string DisplayPc = "displaypc";
        public const string Simple = "SIMPLE";
        public const string ContentProviderDTP = "DTP";


        //Display Cache Keys
        public const string AllCacheKeys = "AllCacheKeys";
        public const string CacheInitialized = "CacheInitialized";

        //viewGroup values used for single and multiview.
        public const string Quad = "QUAD";
        public const string Single = "SINGLE";
        public const string Half = "half";
        public const string Full = "full";
        public const string ScreenType = "screenType";

        // SiteCore Item Details 
        public const string Delete = "delete";

        //allowed Cache Values
        public static List<string> CacheKeys
        {
            get { return new List<string>() { "X-ENT-1-G-Access-Token", "X-ENT-1-TraceId", "viewGroup", "viewId" }; }
        }
    }
}
