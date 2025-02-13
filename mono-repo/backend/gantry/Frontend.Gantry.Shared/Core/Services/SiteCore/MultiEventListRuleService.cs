using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.BusinessLogic.JsonConverters;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Frontend.Vanilla.Content;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface IMultiEventListRuleService
    {
        Task<MultiEventPreviewDetails?> GetDisplayRuleMultiEventItem(string itemId);
    }
    public class MultiEventListRuleService : IMultiEventListRuleService
    {
        private readonly IContentService _contentService;
        private readonly ILogger<SiteCoreDisplayRuleService> _log;

        public MultiEventListRuleService(
            IContentService contentService,
            ILogger<SiteCoreDisplayRuleService> log
        )
        {
            _contentService = contentService;
            _log = log;
        }
        public async Task<MultiEventPreviewDetails?> GetDisplayRuleMultiEventItem(string itemId)
        {
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

            Content<IDocument> document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);
            string? targetingConfiguration;
            if (!(document is SuccessContent<IDocument> { Document: IMultiEventList item }))
            {
                if (!(document is SuccessContent<IDocument> { Document: IMultiEventList item2 }))
                {
                    return null;
                }

                targetingConfiguration = item2.EventList;
            }
            else
            {
                targetingConfiguration = item.EventList;
            }

            if (string.IsNullOrEmpty(targetingConfiguration))
            {
                return null;
            }

            var settings = new JsonSerializerSettings { Converters = new[] { new SiteCoreDisplayRuleItemConverter() } };
            var siteCoreDisplayRuleItemDetails = JsonConvert.DeserializeObject<MultiEventPreviewDetails>(targetingConfiguration, settings);

            return siteCoreDisplayRuleItemDetails;
        }
    }
}