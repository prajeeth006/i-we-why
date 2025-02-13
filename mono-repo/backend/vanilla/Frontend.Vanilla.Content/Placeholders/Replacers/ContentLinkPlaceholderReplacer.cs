#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="ContentImage" />.
/// </summary>
internal sealed class ContentLinkPlaceholderReplacer(IFieldPlaceholderReplacer<ContentParameters> attributesReplacer, IFieldPlaceholderReplacer<Uri> uriReplacer)
    : FieldPlaceholderReplacer<ContentLink>
{
    protected override IEnumerable<string?> GetReplaceableStrings(ContentLink link)
        => attributesReplacer.GetReplaceableStrings(link.Attributes)
            .Concat(uriReplacer.GetReplaceableStrings(link.Url))
            .Append(link.Text);

    protected override ContentLink Recreate(ContentLink link, ReplacedStringMapping replacedStrings)
    {
        var newUrl = uriReplacer.Recreate(link.Url, replacedStrings);
        var newText = replacedStrings.Get(link.Text);
        var newAttrs = attributesReplacer.Recreate(link.Attributes, replacedStrings);

        return new ContentLink(newUrl, newText, newAttrs);
    }
}
