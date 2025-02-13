using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Encapsulates metadata of a DSL expression or action.
/// </summary>
public sealed class DslExpressionMetadata : ToStringEquatable<DslExpressionMetadata>
{
    /// <summary>Gets the volatility of related DSL expression. It equals to the most volatile DSL provider which is used.</summary>
    public ValueVolatility Volatility { get; }

    /// <summary>Indicates that related DSL expression can be fully evaluated only on the client because it uses some provider member which is implemented only there.</summary>
    public bool IsClientOnly { get; }

    /// <summary>Indicates that related DSL expression is already evalusted so calling any evaluate method just returns already final value.</summary>
    public bool IsAlreadyEvaluated { get; }

    /// <summary>Creates a new instance.</summary>
    public DslExpressionMetadata(ValueVolatility volatility = ValueVolatility.Server, bool isClientSideOnly = false, bool isAlreadyEvaluated = false)
    {
        Volatility = Guard.DefinedEnum(volatility, nameof(volatility));
        IsClientOnly = isClientSideOnly;
        IsAlreadyEvaluated = isAlreadyEvaluated;
    }

    /// <summary>Gets string representation of this object.</summary>
    public override string ToString()
        => $"Volatility={Volatility}, ClientSideOnly={IsClientOnly}, AlreadyEvaluated={IsAlreadyEvaluated}";
}
