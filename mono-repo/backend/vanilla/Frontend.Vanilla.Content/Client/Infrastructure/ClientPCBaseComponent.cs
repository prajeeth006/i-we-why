#nullable enable

using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Infrastructure;
#pragma warning disable 1591
/// <summary>
/// A base class for page matrix components (they derive from <see cref="IPCBaseComponent"/>).
/// </summary>
public class ClientPCBaseComponent : ClientFilteredDocument
{
    public string? Class { get; set; }
    public string? Title { get; set; }
    public string? TemplateName { get; set; }
    public string? Name { get; set; }
    public ContentLink? TitleLink { get; set; }
    public ContentParameters? Parameters { get; set; }
}
