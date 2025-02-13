#nullable disable
using System;
using System.Collections.Generic;
using Frontend.Vanilla.Features.Base.Models;

namespace Frontend.Vanilla.Features.Inbox.Models;

internal sealed class InboxMessageViewModel : MessageResultBase<InboxMessageContent>
{
    public string CreatedDate { get; set; }

    public List<string> EligibleProducts { get; set; }

    public string MessageSource { get; set; }

    public string MessageStatus { get; set; }

    public string Error { get; set; }

    public int Priority { get; set; }

    public bool IsExpired => string.Equals(SourceStatus ?? string.Empty, "OFFER_EXPIRED");

    public bool IsNew => string.Equals(MessageStatus ?? string.Empty, "new", StringComparison.OrdinalIgnoreCase);
}
