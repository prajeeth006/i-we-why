using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class StatementBlockRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft?.ResultType != DslType.Void)
            return null;

        context.RemainingTokensOnRight.AddFirst(context.CurrentToken);
        var statement = parser.ParseExpressionFromRemainingTokensOnRight(context);

        if (statement == null) // ParsedExpressionOnLeft is only a single statement -> break
        {
            context.RemainingTokensOnRight.RemoveFirst(); // B/c it's CurrentToken

            return null;
        }

        if (statement.ResultType != DslType.Void)
            throw new ParseException(context.CurrentToken.Position,
                $"Block of statements can contain only {DslType.Void} statements but there is a {statement.ResultType} expression.");

        var statementsOnLeft = (context.ParsedExpressionOnLeft as StatementBlock)?.Statements ?? new[] { context.ParsedExpressionOnLeft };

        return new StatementBlock(statementsOnLeft.Append(statement));
    }

    public static string ToString(StatementBlock block)
        => block.Statements.Join(Environment.NewLine);
}
