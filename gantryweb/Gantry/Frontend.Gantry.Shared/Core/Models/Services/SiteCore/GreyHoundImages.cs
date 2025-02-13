using Bwin.Vanilla.Content.Model;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class GreyHoundImages
    {
        public IList<ContentImage> RunnerImages { get; set; }

        public GreyHoundImages()
        {
            RunnerImages = new List<ContentImage>();
        }
    }


    
}