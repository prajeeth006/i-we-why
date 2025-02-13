using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{
    public interface IBrandImageService
    {
        Task<IBrandImage?> GetBrandImage(string path);
    }

    public class BrandImageService : IBrandImageService
    {
        private readonly IContentService _contentService;

        public BrandImageService(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<IBrandImage?> GetBrandImage(string path)
        {
            IBrandImage? brandImage = null;
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(path);
            Content<IDocument> content = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

            if (content is SuccessContent<IDocument> { Document: IBrandImage image })
            {
                brandImage = image;
            }

            return brandImage;
        }
    }
}