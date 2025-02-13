#nullable enable

using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="IReadOnlyList{IListItem}" />.
/// </summary>
internal sealed class SelectListItemPlaceholderReplacer : FieldPlaceholderReplacer<IReadOnlyList<ListItem>>
{
    protected override IEnumerable<string?> GetReplaceableStrings(IReadOnlyList<ListItem> list)
        => list.Select(i => i.Text);

    protected override IReadOnlyList<ListItem> Recreate(IReadOnlyList<ListItem> list, ReplacedStringMapping replacedStrings)
        => list.ConvertAll(i => new ListItem(i.Value, replacedStrings.Get(i.Text) ?? string.Empty)).AsReadOnly();
}
