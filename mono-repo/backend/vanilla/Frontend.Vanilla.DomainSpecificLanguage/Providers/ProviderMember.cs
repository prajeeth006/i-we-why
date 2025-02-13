using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Represents a member of a DSL provider.
/// </summary>
internal sealed class ProviderMember
{
    public Identifier ProviderName { get; }
    public Identifier MemberName { get; }
    public DslType DslType { get; }
    public IReadOnlyList<ProviderMemberParameter> Parameters { get; }
    public TrimmedRequiredString Documentation { get; }
    public ValueVolatility Volatility { get; }
    public TrimmedRequiredString? ObsoleteMessage { get; }
    public bool IsClientOnly { get; }
    public ProviderMemberAccessor ValueAccessor { get; }
    public bool SkipInitialValueGetOnDslPage { get; }

    public ProviderMember(
        Identifier providerName,
        Identifier memberName,
        DslType dslType,
        IEnumerable<ProviderMemberParameter> parameters,
        TrimmedRequiredString documentation,
        ValueVolatility volatility,
        TrimmedRequiredString? obsoleteMessage,
        bool isClientOnly,
        ProviderMemberAccessor valueAccessor,
        bool skipInitialValueGetOnDslPage)
    {
        ProviderName = providerName;
        MemberName = memberName;
        DslType = dslType;
        Parameters = parameters.ToArray();
        Documentation = documentation;
        Volatility = volatility;
        ObsoleteMessage = obsoleteMessage;
        IsClientOnly = isClientOnly;
        ValueAccessor = valueAccessor;
        SkipInitialValueGetOnDslPage = skipInitialValueGetOnDslPage;

        if (IsClientOnly && Volatility != ValueVolatility.Client)
            throw new Exception($"A ClientSideOnly provider member must have ValueVolatility.Client but {ProviderName}.{MemberName} has ValueVolatility.{Volatility}.");
    }

    public override string ToString()
        => ProviderName + "." + MemberName + (Parameters.Count > 0 ? "(" + Parameters.Join() + ")" : "");
}

/// <summary>Unified delegate to access member value or execute member of DSL provider.</summary>
internal delegate Task<object> ProviderMemberAccessor(ExecutionMode mode, object[] args);

internal sealed class ProviderMemberParameter(DslType type, Identifier name) : ToStringEquatable<ProviderMemberParameter>
{
    public DslType Type { get; } = Guard.NotEqual(type, DslType.Void, nameof(type));
    public Identifier Name { get; } = name;

    public override string ToString()
        => $"{Name}: {Type}";
}
