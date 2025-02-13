#nullable enable

using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Infrastructure;
#pragma warning disable 1591
/// <summary>
/// A base class for templates that have DSL condition (they derive from <see cref="IFilterTemplate"/>).
/// </summary>
public class ClientFilteredDocument : ClientDocument
{
    public string? Condition { get; set; }
}
