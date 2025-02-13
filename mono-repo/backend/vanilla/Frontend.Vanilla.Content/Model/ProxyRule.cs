#nullable enable

namespace Frontend.Vanilla.Content.Model;

/// <summary>
/// Rule defined in proxy content item.
/// </summary>
public sealed class ProxyRule
{
    /// <summary>Gets the condition.</summary>
    public string? Condition { get; }

    /// <summary>Gets the ID of target content which should be returned if <see cref="Condition" /> is matched.</summary>
    public DocumentId? TargetId { get; }

    /// <summary>Creates a new instance.</summary>
    public ProxyRule(string? condition, DocumentId? targetId)
    {
        Condition = condition;
        TargetId = targetId;
    }
}
