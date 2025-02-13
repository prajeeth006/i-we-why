using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IGantryCommonContentService
    {
        Task<GantryCommonContentDetails?> GetContent();
    }
    public class GantryCommonContentService : IGantryCommonContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;

        public GantryCommonContentService(IGantryTemplateContentService gantryTemplateContentService)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
        }

        public async Task<GantryCommonContentDetails?> GetContent()
        {
            GantryCommonContentDetails? content = null;

            ISportsEvent? contentResult = await _gantryTemplateContentService.GetContent(ConstantsSiteCoreItemPaths.GantryCommonContentItemPath);
            
            if (contentResult != null) {
                content = new GantryCommonContentDetails()
                {
                    ContentParameters = contentResult.Content
                };                
            }

            return content;
        }
    }
}