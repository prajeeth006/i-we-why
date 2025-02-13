using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class CarouselUrl
    {
        public int DisplayOrder { get; set; }

        public int CarouselDuration { get; set; }

        public Uri? Url { get; set; }
    }
}