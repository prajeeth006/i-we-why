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
        GantryAvrPageConfiguration GetAvrPageTimingsBasedOnControllerId(string controllerId);
    }
    public class AvrContentService : IAvrContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;
        private readonly IGantryAvrControllerBasedTimings _avrTiming;

        public GantryAvrPageConfiguration GetAvrPageTimingsBasedOnControllerId(string? controllerId)
        {
            if (_avrTiming != null) {
                if (_avrTiming.AvrPageTimingsBasedOnControllerId.ContainsKey(controllerId)) {
                    return _avrTiming.AvrPageTimingsBasedOnControllerId[controllerId];
                }
            }
            return null;
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
            
            if (content != null) {
                contentDetails = new AvrContentDetails()
                {
                    ContentParameters = content.Content
                };                
            }

            return contentDetails;
        }
    }
}