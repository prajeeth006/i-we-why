#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Features.Inbox;

internal sealed class InboxDetailImage(string detailImage, ContentLink imageLink)
{
    public string DetailImage { get; set; } = detailImage;

    public string DetailImageLink => ImageLink?.Url.ToString() ?? string.Empty;

    public IReadOnlyDictionary<string, string> DetailImageAttrs => ImageLink?.Attributes;

    public ContentLink ImageLink { get; set; } = imageLink;
}
