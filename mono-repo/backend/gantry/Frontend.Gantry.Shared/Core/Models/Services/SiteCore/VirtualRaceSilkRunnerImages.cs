using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class VirtualRaceSilkRunnerImages
    {
        public IList<ContentImage> RunnerImages { get; set; }

        public VirtualRaceSilkRunnerImages()
        {
            RunnerImages = new List<ContentImage>();
        }
    }
}