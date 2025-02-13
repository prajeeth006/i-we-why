using System;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// A name-value pair representing query string parameter which is sent to DynaCon REST service to retrieve the configuration.
/// </summary>
public sealed class DynaConParameter : ToStringEquatable<DynaConParameter>
{
    internal const string ContextPrefix = "context.";
    internal const string ServiceName = "service";

    static DynaConParameter()
        => Comparison = StringComparison.OrdinalIgnoreCase; // Comparison for ToStringEquatable<>

    /// <summary>Gets the name.</summary>
    public string Name { get; }

    /// <summary>Gets the value.</summary>
    public string Value { get; }

    /// <summary>Creates a new instance.</summary>
    public DynaConParameter(string name, string value)
    {
        Name = Guard.TrimmedRequired(name, nameof(name));
        Value = Guard.TrimmedRequired(value, nameof(value));

        Guard.Requires(name, n => !n.StartsWith(".") && !n.EndsWith("."), nameof(name), "Name cannot start nor end with a dot.");
        Guard.Requires(name,
            n => !n.EqualsIgnoreCase("changesetId"),
            nameof(name),
            "ChangesetId can't be specified. Use DynaConEngineSettingsBuilder.ExplicitChangesetId instead.");
    }

    /// <summary>Returns a string representation of this object.</summary>
    public override string ToString()
        => $"'{Name}'='{Value}'";
}
