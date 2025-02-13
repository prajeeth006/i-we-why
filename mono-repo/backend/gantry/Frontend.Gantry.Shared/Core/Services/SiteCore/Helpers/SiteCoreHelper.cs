using System;
using Frontend.Vanilla.Content;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers
{
    public static class SiteCoreHelper
    {
        public static DocumentId GetDocumentIdBasedOnPathOrItemId(string itemIdOrPath)
        {
            DocumentId documentId = Guid.TryParse(itemIdOrPath, out Guid cmsId)
                ? new DocumentId($"/id/{cmsId}", DocumentPathRelativity.AbsoluteRoot)
                : new DocumentId($"{itemIdOrPath}", DocumentPathRelativity.AbsoluteRoot);

            return documentId;
        }
    }
}