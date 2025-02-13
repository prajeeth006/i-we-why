#nullable enable

using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="ContentImage" />.
/// </summary>
internal sealed class ContentImagePlaceholderReplacer : FieldPlaceholderReplacer<ContentImage>
{
    protected override IEnumerable<string?> GetReplaceableStrings(ContentImage image)
        => new[] { image.Src, image.Alt };

    protected override ContentImage Recreate(ContentImage image, ReplacedStringMapping replacedStrings)
        => new (replacedStrings.Get(image.Src), replacedStrings.Get(image.Alt), image.Width, image.Height);
}
