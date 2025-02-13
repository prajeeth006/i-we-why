using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Models;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Frontend.Vanilla.Content;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface ISiteCoreStaticPromotionService
    {
        Task<StaticPromotion> GetContent(string itemIdOrPath);
    }

    public class SiteCoreStaticPromotionService : ISiteCoreStaticPromotionService
    {
        private readonly IContentService _contentService;

        public SiteCoreStaticPromotionService(
            IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<StaticPromotion> GetContent(string itemIdOrPath)
        {
            if (!string.IsNullOrEmpty(itemIdOrPath))
            {
                DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemIdOrPath);
                var staticPromotion = await GetContent<StaticPromotion>(documentId);

                return staticPromotion;
            }

            return null;
        }

        #region Helpers

        private async Task<T> GetContent<T>(DocumentId contentDocumentId)
            where T : class
        {
            Content<IDocument> contentDocument =
                await _contentService.GetContentAsync<IDocument>(contentDocumentId, CancellationToken.None);

            if (!(contentDocument is SuccessContent<IDocument> content))
            {
                return default!;
            }

            var promotionContent = ConvertToPromotionContent<T>(content.Document);

            return promotionContent;

        }

        private T ConvertToPromotionContent<T>(IDocument document)
            where T : class
        {
            var promotionContent = Activator.CreateInstance<T>();

            if (!(document is ICricket cricketDocument))
            {
                return default!;
            }

            MapSourceToTarget(cricketDocument,
                promotionContent as StaticPromotion ??
                throw new InvalidOperationException($"promotionContent is not of type {typeof(StaticPromotion)}"));

            return promotionContent;
        }

        private void MapSourceToTarget(ICricket source, StaticPromotion target)
        {
            target.BackgroundImage = source.BackgroundImage;
            target.ForegroundImage = source.ForegroundImage;
            target.Description = source.Description;
            target.Title = source.Title;
        }

        #endregion
    }
}
