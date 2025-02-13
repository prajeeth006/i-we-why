using System;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing;

/// <summary>
/// Main logic for full parsing of DSL expression.
/// </summary>
internal interface IExpressionTreeParser
{
    WithWarnings<IExpressionTree> Parse(RequiredString expression, Type resultType);
}

internal sealed class ExpressionTreeParser(ILexicalParser lexicalParser, ISyntaxParser syntaxParser, ILegacySyntaxConverter legacyConverter)
    : IExpressionTreeParser
{
    public static readonly ReadOnlySet<Type> SupportedResultTypes
        = Enum<DslType>.Values.Select(t => t.ToClrType()).Append(typeof(object)).ToHashSet().AsReadOnly();

    public WithWarnings<IExpressionTree> Parse(RequiredString expression, Type resultType)
    {
        var unsupportedChars = expression.Value.Where(c => !char.IsLetterOrDigit(c) && !char.IsPunctuation(c) && !char.IsSymbol(c) && !char.IsWhiteSpace(c)).ToList();

        if (unsupportedChars.Count > 0)
        {
            var message = "Expression can contain only letters, digits, punctuation, symbols or white-spaces"
                          + $" but it contains unsupported characters (may be invisible): {unsupportedChars.Dump()}.";

            throw new ArgumentException(message, nameof(expression));
        }

        if (!SupportedResultTypes.Contains(resultType))
        {
            var message = $"Requested result type {resultType} is not supported (not assignable from any) type in Vanilla DSL."
                          + $" Supported types are: {SupportedResultTypes.Except(typeof(VoidDslResult)).Append(typeof(void)).Dump()}.";

            throw new ArgumentException(message, nameof(resultType));
        }

        try
        {
            var (convertedExpression, legacyWarnings) = legacyConverter.Convert(expression);
            var tokens = lexicalParser.Parse(convertedExpression);
            var (parsedExpression, syntaxWarnings) = syntaxParser.Parse(tokens);

            if (!resultType.IsAssignableFrom(parsedExpression.ResultType.ToClrType())
                || (resultType == typeof(object) && parsedExpression.ResultType == DslType.Void))
                throw new Exception($"Expression is of type {parsedExpression.ResultType} but incompatible {resultType} was expected/requested.");

            return parsedExpression.WithWarnings(legacyWarnings.Concat(syntaxWarnings));
        }
        catch (Exception ex)
        {
            // This must be nice comprehensive message b/c it's shown to editors at /health/dsl
            var exprInfo = ex is ParseException pex ? $" at position {pex.Position} containing '{expression.Value.SubstringMax(pex.Position, 50)}'" : null;
            var message =
                $"Failed parsing DSL expression '{expression}'{exprInfo}. To understand and fix the error, read https://docs.vanilla.intranet/domain-specific-language.html#syntax";

            throw new Exception(message, ex);
        }
    }
}
