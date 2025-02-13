using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IAvrContentService
    {
        Task<AvrContentDetails?> GetContent();
        AvrPageConfiguration GetAvrPageTimingsBasedOnControllerId(string controllerId);
    }
    public class AvrContentService : IAvrContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;
        private readonly IGantryAvrControllerBasedTimings _avrTiming;

        public AvrPageConfiguration GetAvrPageTimingsBasedOnControllerId(string? controllerId)
        {
            if (_avrTiming == null || controllerId == null)
            {
                return null;
            }

            var avrConfigs = new AvrPageConfiguration
            {
                gantryAvrPageConfiguration = new GantryAvrPageConfiguration(),
                gantryAvrPageOverlay = new GantryAvrPageOverlay(),
            };

            if (_avrTiming.AvrPageTimingsBasedOnControllerId.TryGetValue(controllerId, out var pageConfig))
            {
                avrConfigs.gantryAvrPageConfiguration = pageConfig;
            }
            if (_avrTiming.AvrVideoOverlayBasedOnControllerId.TryGetValue(controllerId, out var videoOverlay))
            {
                avrConfigs.gantryAvrPageOverlay = videoOverlay;
            }
            return avrConfigs;
        }

        public AvrContentService(IGantryTemplateContentService gantryTemplateContentService, IGantryAvrControllerBasedTimings avrTiming)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
            _avrTiming = avrTiming;
        }

        public async Task<AvrContentDetails?> GetContent()
        {
            AvrContentDetails? contentDetails = null;

            ISportsEvent? content = await _gantryTemplateContentService.GetContent(ConstantsSiteCoreItemPaths.AvrContentItemPath);

            if (content != null)
            {
                contentDetails = new AvrContentDetails()
                {
                    ContentParameters = content.Content,
                    RacingVirtualImage = content.RacingVirtualImage
                };
            }

            return contentDetails;
        }
    }
}
