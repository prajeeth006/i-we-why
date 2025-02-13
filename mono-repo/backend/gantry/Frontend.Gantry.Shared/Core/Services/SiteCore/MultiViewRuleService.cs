using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.BusinessLogic.JsonConverters;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;


namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface IMultiViewRuleService
    {
        Task<SiteCoreDisplayRuleItemDetails?> GetDisplayRuleMultiViewItem(string itemId);
    }

    public class MultiViewRuleService : IMultiViewRuleService
    {
        private readonly IContentService _contentService;
        private readonly ILogger<SiteCoreDisplayRuleService> _log;

        public MultiViewRuleService(
            IContentService contentService,
            ILogger<SiteCoreDisplayRuleService> log
            )
        {
            _contentService = contentService;
            _log = log;
        }


        public async Task<SiteCoreDisplayRuleItemDetails?> GetDisplayRuleMultiViewItem(string itemId)
        {
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

            Content<IDocument> document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None, new ContentLoadOptions
            {
                BypassCache = true
            });

            string? targetingConfiguration;
            if (!(document is SuccessContent<IDocument> { Document: IGantryConfigMultiViewItem item }))
            {
                if (!(document is SuccessContent<IDocument> { Document: IGantryConfigItem item2 }))
                {
                    return null;
                }

                targetingConfiguration = item2.TargetingConfiguration;
            }
            else
            {
                targetingConfiguration = item.TargetingConfiguration;
            }


            if (string.IsNullOrEmpty(targetingConfiguration))
            {
                return null;
            }

            var settings = new JsonSerializerSettings { Converters = new[] { new SiteCoreDisplayRuleItemConverter() } };
            var siteCoreDisplayRuleItemDetails = JsonConvert.DeserializeObject<SiteCoreDisplayRuleItemDetails>(targetingConfiguration, settings);

            return siteCoreDisplayRuleItemDetails;

        }
    }
}