using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class LiteralRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft != null)
            return null;

        if (context.CurrentToken.Is(Keyword.Subtraction))
        {
            var rightExpression = parser.ParseExpressionFromRemainingTokensOnRight(context);
            var literal = rightExpression as NumberLiteral;

            if (literal == null)
                throw new Exception($"{Keyword.Subtraction} as a negative sign must be in front of a Number literal"
                                    + $" but there is {rightExpression?.ResultType.ToString() ?? "nothing"} on the right.");

            return NumberLiteral.Get(-1 * literal.Value);
        }

        return context.CurrentToken switch
        {
            KeywordToken t when t.Keyword == Keyword.True => BooleanLiteral.True,
            KeywordToken t when t.Keyword == Keyword.False => BooleanLiteral.False,
            StringLiteralToken t => StringLiteral.Get(t.Value),
            NumberLiteralToken t => NumberLiteral.Get(t.Value),
            _ => null,
        };
    }

    public static string ToString(Literal literal)
        => literal switch
        {
            BooleanLiteral t when t.Value => Keyword.True.Value,
            BooleanLiteral t when !t.Value => Keyword.False.Value,
            StringLiteral s => s.Value.Contains("'") ? $@"""{s.Value}""" : $@"'{s.Value}'",
            NumberLiteral n => n.Value.ToInvariantString(),
            VoidLiteral _ => "(void literal, DSL action fully executed)",
            _ => throw new ArgumentException($"Unknown literal type {literal.GetType()}."),
        };
}
