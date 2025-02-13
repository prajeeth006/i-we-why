using Bwin.Vanilla.Content;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl
{
    public interface ITargetItem 
    {
        Task<Uri> GetTargetItem(string? targetItempPath);
    }
    public class TargetItem : ITargetItem
    {
        private readonly IContentService _contentService;

        public TargetItem(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<Uri> GetTargetItem(string? targetItemId)
        {
            Uri result = null;

            if (!string.IsNullOrEmpty(targetItemId))
            {
                var documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(targetItemId);
                var document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

                if (document is SuccessContent<IDocument> { Document: ILabelUrl content })
                {
                    result = content.SmartLink.Url;
                }
            }

            return result;
        }
    }
}