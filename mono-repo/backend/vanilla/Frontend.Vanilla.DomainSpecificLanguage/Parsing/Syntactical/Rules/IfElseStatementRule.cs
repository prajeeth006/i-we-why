using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class IfElseStatementRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        return context.ParsedExpressionOnLeft == null && context.CurrentToken.Is(Keyword.If)
            ? ParseIfElseStatementFromRemainingTokensOnRight(context.CurrentToken.Position, openingKeyword: Keyword.If)
            : null;

        IfElseStatement ParseIfElseStatementFromRemainingTokensOnRight(int position, Keyword openingKeyword)
        {
            var condition = parser.ParseExpressionFromRemainingTokensOnRight(context);

            if (condition?.ResultType != DslType.Boolean)
                throw new ParseException(position, $"{openingKeyword} must be followed by {DslType.Boolean} condition"
                                                   + $" but there is {condition?.ResultType.ToString() ?? "nothing"}.");

            var nextToken = context.RemainingTokensOnRight.First?.Value;

            if (nextToken == null || !nextToken.Is(Keyword.Then))
                throw new ParseException(position, $"Condition after {Keyword.If} must be followed by {Keyword.Then}"
                                                   + $" but there is {nextToken?.ToString() ?? "nothing"}.");

            position = nextToken.Position;
            context.RemainingTokensOnRight.RemoveFirst(); // Removes THEN

            var thenStatement = parser.ParseExpressionFromRemainingTokensOnRight(context);

            if (thenStatement?.ResultType != DslType.Void)
                throw new ParseException(position, $"{Keyword.Then} must be followed by {DslType.Void} statement(s)"
                                                   + $" but there is {thenStatement?.ResultType.ToString() ?? "nothing"}.");

            IExpressionTree? elseStatement;
            nextToken = context.RemainingTokensOnRight.First?.Value;

            if (nextToken.Is(Keyword.Else))
            {
                position = nextToken.Position;
                context.RemainingTokensOnRight.RemoveFirst(); // Removes ELSE

                elseStatement = parser.ParseExpressionFromRemainingTokensOnRight(context);

                if (elseStatement?.ResultType != DslType.Void)
                    throw new ParseException(position, $"{Keyword.Else} must be followed by {DslType.Void} statement(s)"
                                                       + $" but there is {elseStatement?.ResultType.ToString() ?? "nothing"}.");

                nextToken = context.RemainingTokensOnRight.First?.Value;

                if (!nextToken.Is(Keyword.End))
                    throw new ParseException(position, $"Statement(s) after {Keyword.Else} must be closed by {Keyword.End}"
                                                       + $" but there is {nextToken?.ToString() ?? "nothing"}.");

                context.RemainingTokensOnRight.RemoveFirst(); // Removes END
            }
            else if (nextToken.Is(Keyword.ElseIf))
            {
                context.RemainingTokensOnRight.RemoveFirst(); // Removes ELSE-IF
                elseStatement = ParseIfElseStatementFromRemainingTokensOnRight(nextToken.Position, openingKeyword: Keyword.ElseIf);
            }
            else if (nextToken.Is(Keyword.End))
            {
                elseStatement = null;
                context.RemainingTokensOnRight.RemoveFirst(); // Removes END
            }
            else
            {
                throw new ParseException(position, $"Statement(s) after {Keyword.Then} must be closed with {Keyword.End}"
                                                   + $" or followed by {Keyword.Else} or {Keyword.ElseIf} to start an alternative statement but there is {nextToken?.ToString() ?? "nothing"}.");
            }

            return new IfElseStatement(condition, thenStatement, elseStatement);
        }
    }

    public static string ToString(IfElseStatement statement)
    {
        var builder = new IndentedStringBuilder();
        BuildDslString(builder, statement, openingKeyword: Keyword.If);

        return builder.ToString().TrimEnd();

        static void BuildDslString(IndentedStringBuilder builder, IfElseStatement statement, Keyword openingKeyword)
        {
            builder.AppendLine($"{openingKeyword.Value} {statement.Condition} {Keyword.Then.Value}")
                .Indent()
                .AppendLines(statement.ThenStatement.ToString()!)
                .Unindent();

            switch (statement.ElseStatement)
            {
                case null:
                    builder.AppendLine(Keyword.End.Value);

                    break;

                case IfElseStatement next:
                    BuildDslString(builder, next, openingKeyword: Keyword.ElseIf);

                    break;

                default:
                    builder.AppendLine(Keyword.Else.Value)
                        .Indent()
                        .AppendLines(statement.ElseStatement.ToString()!)
                        .Unindent()
                        .AppendLine(Keyword.End.Value);

                    break;
            }
        }
    }
}
