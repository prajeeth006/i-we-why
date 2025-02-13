using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface IGantryTemplateContentService 
    {
        Task<ISportsEvent?> GetContent(string itemIdOrPath);
    }
    public class GantryTemplateContentService : IGantryTemplateContentService
    {
        private readonly IContentService _contentService;

        public GantryTemplateContentService(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<ISportsEvent?> GetContent(string itemIdOrPath)
        {
            ISportsEvent? eventContent = null;
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemIdOrPath);
            Content<IDocument> sportEvent = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

            if (sportEvent is SuccessContent<IDocument> { Document: ISportsEvent content })
            {
                eventContent = content;
            }

            return eventContent;
        }
    }
}