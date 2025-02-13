using System;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class MultiViewUrl
    {
        public  int DisplayOrder { get; set; }
        public Uri? Url { get; set; }
        public bool IsQuadUpdated { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}