using Frontend.Vanilla.Content;
using Frontend.Vanilla.Features.Globalization;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Inbox.ContentProviders;

internal sealed class InboxAccountContentProvider(
    IContentService contentService,
    ILogger<InboxAccountContentProvider> log,
    IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    : InboxContentProviderBase(contentService, log, dateTimeCultureBasedFormatter)
{
    public override string MessageSource => "Account";
}
