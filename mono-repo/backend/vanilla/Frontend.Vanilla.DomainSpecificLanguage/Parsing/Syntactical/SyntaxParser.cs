using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;

internal interface ISyntaxParser
{
    WithWarnings<IExpressionTree> Parse(IEnumerable<Token> tokens);
    IExpressionTree? ParseExpressionFromRemainingTokensOnRight(ParsingContext context, KeywordToken? previousOperator = null);
}

internal sealed class SyntaxParser(IProviderAccessFactory providerAccessFactory) : ISyntaxParser
{
    public WithWarnings<IExpressionTree> Parse(IEnumerable<Token> tokens)
    {
        var remainingTokens = new LinkedList<Token>(tokens);
        var allWarnings = new List<TrimmedRequiredString>();
        var localVariables = new Dictionary<TrimmedRequiredString, DslType>();

        var expression = ParseExpression(remainingTokens, allWarnings, localVariables, previousOperator: null);

        if (expression == null)
            throw new ParseException(0, $"No relevant expression was parsed out. Found only irrelevant tokens: {remainingTokens.Dump()}.");
        if (remainingTokens.First?.Value is Token unexpectedToken)
            throw new ParseException(unexpectedToken.Position, $"Found unexpected token {unexpectedToken}.");

        if (localVariables.Count > 0)
            expression = new LocalVariableDeclaration(expression, localVariables);

        return expression.WithWarnings(allWarnings);
    }

    private IExpressionTree? ParseExpression(
        LinkedList<Token> remainingTokens,
        ICollection<TrimmedRequiredString> allWarnings,
        IDictionary<TrimmedRequiredString, DslType> localVariables,
        KeywordToken? previousOperator)
    {
        IExpressionTree? parsedExpressionOnLeft = null;

        while (remainingTokens.Count > 0)
        {
            var context = new ParsingContext(remainingTokens.First!.Value, parsedExpressionOnLeft, remainingTokens, previousOperator, allWarnings, localVariables);
            remainingTokens.RemoveFirst();

            try
            {
                var parsedExpression = new StatementBlockRule().TryParse(context, this)
                                       ?? new IfElseStatementRule().TryParse(context, this)
                                       ?? new TernaryConditionalOperationRule().TryParse(context, this)
                                       ?? new LocalVariableAssignmentRule().TryParse(context, this)
                                       ?? new LocalVariableAccessRule().TryParse(context, this)
                                       ?? new LiteralRule().TryParse(context, this)
                                       ?? new MemberAccessRule(providerAccessFactory).TryParse(context, this)
                                       ?? new ExpressionInParenthesesRule().TryParse(context, this)
                                       ?? new InOperationRule().TryParse(context, this)
                                       ?? new UnaryOperationRule().TryParse(context, this)
                                       ?? new BinaryOperationRule().TryParse(context, this);

                if (parsedExpression == null) // If current token can't be parsed -> move it back and let parent context decide what to do
                {
                    remainingTokens.AddFirst(context.CurrentToken);

                    return context.ParsedExpressionOnLeft;
                }

                parsedExpressionOnLeft = parsedExpression;
            }
            catch (DslArgumentException ex)
            {
                throw new ParseException(context.CurrentToken.Position, $"Failed creating meaningful DSL expression based on {context.CurrentToken}.", ex);
            }
            catch (Exception ex) when (!(ex is ParseException))
            {
                throw new ParseException(context.CurrentToken.Position, $"Failed processing DSL token {context.CurrentToken}.", ex);
            }
        }

        return parsedExpressionOnLeft; // Parsed to the end
    }

    public IExpressionTree? ParseExpressionFromRemainingTokensOnRight(ParsingContext context, KeywordToken? previousOperator)
        => ParseExpression(context.RemainingTokensOnRight, context.AllWarnings, context.LocalVariables, previousOperator);
}

internal static class SyntaxParserHelper
{
    public static bool Is([NotNullWhen(true)] this LinkedListNode<Token>? token, Keyword testedKeyword)
        => Is(token?.Value, testedKeyword);

    public static bool Is([NotNullWhen(true)] this Token? token, Keyword testedKeyword)
        => (token as KeywordToken)?.Keyword == testedKeyword;
}
