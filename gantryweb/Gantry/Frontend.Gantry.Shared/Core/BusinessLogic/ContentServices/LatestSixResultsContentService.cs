using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface ILatestSixResultsContentService
    {
        Task<LatestSixResultsContentDetails?> GetContent();
    }
    public class LatestSixResultsContentService : ILatestSixResultsContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;

        public LatestSixResultsContentService(IGantryTemplateContentService gantryTemplateContentService)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
        }

        public async Task<LatestSixResultsContentDetails?> GetContent()
        {
            LatestSixResultsContentDetails? latestSixResultsContentDetails = null;

            ISportsEvent? content = await _gantryTemplateContentService.GetContent(ConstantsSiteCoreItemPaths.LatestSixResultsContentItemPath);
            
            if (content != null) {
                latestSixResultsContentDetails = new LatestSixResultsContentDetails()
                {
                    RacingPostImage  = content.RacingPostImage,
                    ContentParameters = content.Content
                };                
            }

            return latestSixResultsContentDetails;
        }
    }
}