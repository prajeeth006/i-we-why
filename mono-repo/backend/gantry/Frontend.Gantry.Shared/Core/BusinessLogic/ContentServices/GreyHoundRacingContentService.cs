using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IGreyHoundRacingContentService
    {
        Task<GreyHoundRacingContentDetails?> GetContent();
    }
    public class GreyHoundRacingContentService : IGreyHoundRacingContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;

        public GreyHoundRacingContentService(IGantryTemplateContentService gantryTemplateContentService)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
        }

        public async Task<GreyHoundRacingContentDetails?> GetContent()
        {
            GreyHoundRacingContentDetails? greyHoundRacingContentDetails = null;

            ISportsEvent? content = await _gantryTemplateContentService.GetContent(ConstantsSiteCoreItemPaths.GreyHoundRacingContentItemPath);
            
            if (content != null) {
                greyHoundRacingContentDetails = new GreyHoundRacingContentDetails()
                {
                    RacingPostImage  = content.RacingPostImage,
                    RacingPostImageFull = content.RacingPostImageFull,
                    ContentParameters = content.Content,
                    GreyHoundRacingImage=content.GreyHoundRacingImage,
                    RacingVirtualImage= content.RacingVirtualImage,
                    GreyHoundRacingPostPic = content.GreyHoundRacingPostPic
                };                
            }

            return greyHoundRacingContentDetails;
        }
    }
}
