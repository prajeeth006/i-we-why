using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Dsl;

public sealed class DslMetadataResponse(IEnumerable<ProviderMetadata> providers, IEnumerable<DslSyntaxHint> syntaxHints)
{
    public IReadOnlyList<ProviderMetadata> Providers { get; } = providers.ToList();
    public IReadOnlyList<DslSyntaxHint> SyntaxHints { get; } = syntaxHints.ToList();
}
