using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Defines types that can be used in Vanilla DSL.
/// </summary>
internal enum DslType
{
    String,
    Number,
    Boolean,
    Void,
}

internal static class DslTypeHelper
{
    public static readonly IReadOnlyDictionary<Type, DslType> ClrTypesToDsl
        = Enum<DslType>.Values.ToDictionary(t => t.ToClrType());

    public static readonly IReadOnlyList<DslType> ResultTypes
        = Enum<DslType>.Values.Except(DslType.Void).ToArray();

    public static Type ToClrType(this DslType dslType)
        => dslType switch
        {
            DslType.String => typeof(string),
            DslType.Number => typeof(decimal),
            DslType.Boolean => typeof(bool),
            DslType.Void => typeof(VoidDslResult),
            _ => throw dslType.GetInvalidException(),
        };
}
