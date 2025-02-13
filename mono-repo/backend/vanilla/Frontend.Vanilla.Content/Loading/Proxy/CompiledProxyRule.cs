using Frontend.Vanilla.DomainSpecificLanguage;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Loading.Proxy;

internal sealed class CompiledProxyRule([CanBeNull] IDslExpression<bool> condition, [CanBeNull] DocumentId targetId)
{
    [CanBeNull]
    public IDslExpression<bool> Condition { get; } = condition;

    [CanBeNull]
    public DocumentId TargetId { get; } = targetId;
}
