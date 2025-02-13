#nullable enable

using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.Client.Infrastructure;
#pragma warning disable 1591
/// <summary>
/// Base class for client content POCO classes.
/// </summary>
public class ClientDocument
{
    [JsonIgnore]
    public DocumentId? InternalId { get; set; }
}
