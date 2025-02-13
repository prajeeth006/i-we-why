using Frontend.Vanilla.Features.Base;

namespace Frontend.Vanilla.Features.Inbox.ContentProviders;

internal interface IInboxContentProvider : IContentProvider<InboxMessageContent>
{
    string MessageSource { get; }
}
