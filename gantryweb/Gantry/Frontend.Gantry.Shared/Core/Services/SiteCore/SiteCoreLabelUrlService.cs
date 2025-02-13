using System;
using System.Threading;
using System.Threading.Tasks;
using Bwin.Vanilla.Content;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface ISiteCoreLabelUrlService
    {
        Task<Uri> GetLabelUrl();
    }

    public class SiteCoreLabelUrlService : ISiteCoreLabelUrlService
    {
        private readonly IContentService _contentService;
        private readonly ILogger<SiteCoreLabelUrlService> _log;

        public SiteCoreLabelUrlService(
            IContentService contentService,
            ILogger<SiteCoreLabelUrlService> log
            )
        {
            _contentService = contentService;
            _log = log;
        }

        public async Task<Uri> GetLabelUrl()
        {
            Uri? result = null;
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(ConstantsSiteCoreItemPaths.LabelUrl);

            Content<IDocument> labelUrl = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

            if (labelUrl is SuccessContent<IDocument> { Document: ILabelUrl url })
            {
                result = url.SmartLink?.Url;
            }

            if (result == null)
            {
                throw new Exception($"Couldn't find the label url: '{ConstantsSiteCoreItemPaths.LabelUrl}'");
            }

            return result;
        }
    }
}