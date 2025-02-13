using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Dsl;

public sealed class ProviderMetadata(string name, string documentation, string assembly, IEnumerable<MemberMetadata> members)
{
    public string Name { get; } = name;
    public string Documentation { get; } = documentation;
    public string Assembly { get; } = assembly;
    public IReadOnlyList<MemberMetadata> Members { get; } = members.ToList();
}

public sealed class MemberMetadata(string signature, string documentation, string type, string volatility, bool clientSideOnly, string? obsoleteMessage, bool isProperty)
{
    public string Signature { get; } = signature;
    public string Documentation { get; } = documentation;
    public string Type { get; } = type;
    public string Volatility { get; } = volatility;
    public bool ClientSideOnly { get; } = clientSideOnly;
    public string? ObsoleteMessage { get; } = obsoleteMessage;
    public bool IsProperty { get; } = isProperty;
}
