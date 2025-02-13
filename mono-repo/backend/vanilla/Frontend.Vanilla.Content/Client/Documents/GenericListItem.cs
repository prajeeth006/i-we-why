#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IGenericListItem"/>.
/// </summary>
public sealed class ClientGenericListItem : ClientDocument
{
    private ContentParameters messages = ContentParameters.Empty;

    public ContentParameters Messages
    {
        get => messages;
        set => messages = Guard.NotNull(value, nameof(value));
    }
}
