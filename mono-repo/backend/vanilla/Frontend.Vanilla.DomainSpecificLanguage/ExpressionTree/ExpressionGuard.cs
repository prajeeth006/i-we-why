using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

internal static class ExpressionGuard
{
    public static IExpressionTree GuardResultType(this IExpressionTree expression, DslType supportedType, string paramName)
        => expression.GuardResultType(new[] { supportedType }, paramName);

    public static IExpressionTree GuardResultType(this IExpressionTree expression, IEnumerable<DslType> supportedTypes, string paramName)
        => supportedTypes.Contains(expression.ResultType)
            ? expression
            : throw new ArgumentException($"Expression must return type {supportedTypes.Join(" or ")} but it returns {expression.ResultType}.", paramName);

    public static DslType GuardNotVoid(this DslType type, string paramName)
        => type != DslType.Void
            ? type
            : throw new ArgumentException("Void expression isn't supported.", paramName);
}
