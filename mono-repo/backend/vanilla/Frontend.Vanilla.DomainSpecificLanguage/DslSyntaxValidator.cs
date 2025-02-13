using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Validates DSL expression.
/// </summary>
public interface IDslSyntaxValidator
{
    /// <summary>Validates DSL expression and returns a message suitable for user.</summary>
    DslSyntaxResult Validate(RequiredString expression, Type resultType);
}

/// <summary>
/// Result of syntax validation of some DSL expression.
/// </summary>
public sealed class DslSyntaxResult
{
    /// <summary>Gets the actual error message if the expression is invalid.</summary>
    public TrimmedRequiredString? ErrorMessage { get; }

    /// <summary>Gets additional warnings related to valid the expression.</summary>
    public IReadOnlyList<TrimmedRequiredString> Warnings { get; }

    /// <summary>Creates a new instance. It's considered valid if no <paramref name="errorMessage" /> is provided.</summary>
    public DslSyntaxResult(TrimmedRequiredString? errorMessage = null, IEnumerable<TrimmedRequiredString>? warnings = null)
    {
        ErrorMessage = errorMessage;
        Warnings = Guard.NotNullItems((warnings?.ToArray().AsReadOnly()).NullToEmpty(), nameof(warnings));
    }
}

internal sealed class DslSyntaxValidator(IExpressionTreeParser parser) : IDslSyntaxValidator
{
    public DslSyntaxResult Validate(RequiredString expression, Type resultType)
    {
        try
        {
            var result = parser.Parse(expression, resultType);

            return new DslSyntaxResult(warnings: result.Warnings);
        }
        catch (Exception ex) when (!(ex is ArgumentException))
        {
            return new DslSyntaxResult(ex.GetMessageIncludingInner());
        }
    }
}
