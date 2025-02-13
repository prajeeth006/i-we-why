using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IHorseRacingContentService
    {
        Task<HorseRacingContentDetails?> GetContent();
    }
    public class HorseRacingContentService : IHorseRacingContentService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;

        public HorseRacingContentService(IGantryTemplateContentService gantryTemplateContentService)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
        }

        public async Task<HorseRacingContentDetails?> GetContent()
        {
            HorseRacingContentDetails? horseRacingContentDetails = null;

            ISportsEvent? content = await _gantryTemplateContentService.GetContent(ConstantsSiteCoreItemPaths.HorseRacingContentItemPath);

            if (content != null)
            {
                horseRacingContentDetails = new HorseRacingContentDetails()
                {
                    RacingPostImage = content.RacingPostImage,
                    ContentParameters = content.Content,
                    HorseRacingImage = content.HorseRacingImage,
                    DarkThemeRacingPostImage = content.DarkThemeRacingPostImage,
                    RacingVirtualImage = content.RacingVirtualImage,
                    FallbackImage = content.FallbackImage,
                    MoneyBoostImage = content.MoneyBoostImage,
                    EpsFooterLogoNewDesign = content.EpsFooterLogoNewDesign,
                    ScrollingRacingPostTip = content.ScrollingRacingPostTip,
                };
            }

            return horseRacingContentDetails;
        }
    }
}
