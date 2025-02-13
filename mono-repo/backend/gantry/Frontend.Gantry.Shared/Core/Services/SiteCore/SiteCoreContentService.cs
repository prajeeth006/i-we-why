using System.Threading;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Frontend.Vanilla.Content;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface ISiteCoreContentService
    {
        Task<T> GetContent<T>(string itemId) where T:class;
    }

    public class SiteCoreContentService : ISiteCoreContentService
    {
        private readonly IContentService _contentService;

        public SiteCoreContentService(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<T> GetContent<T>(string itemId) where T : class
        {
            T result = null;

            if (!string.IsNullOrEmpty(itemId))
            {
                DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

                Content<IDocument> document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);
                
                if ((document is SuccessContent<IDocument> { Document: T item }))
                {
                    result = item;
                }
            }

            return result;
        }
    }
}