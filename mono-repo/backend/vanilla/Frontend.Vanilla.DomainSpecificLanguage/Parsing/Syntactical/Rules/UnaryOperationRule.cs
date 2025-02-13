using System.Linq;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class UnaryOperationRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft != null
            || !(context.CurrentToken is KeywordToken currentToken))
            return null;

        var @operator = UnaryOperators.Operators.FirstOrDefault(o => currentToken.Keyword == o.Keyword);

        if (@operator == null)
            return null;

        var operand = parser.ParseExpressionFromRemainingTokensOnRight(context, previousOperator: currentToken);

        return new UnaryOperation(@operator, operand);
    }

    public static string ToString(UnaryOperation operation)
        => ExpressionInParenthesesRule.ToString($"{operation.Operator.Keyword.Value} {operation.Operand}");
}
