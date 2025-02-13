using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;

/// <summary>
/// Current state of syntactical expression parsing.
/// </summary>
internal sealed class ParsingContext(
    Token currentToken,
    IExpressionTree? parsedExpressionOnLeft,
    LinkedList<Token> remainingTokensOnRight,
    KeywordToken? previousOperator,
    ICollection<TrimmedRequiredString> allWarnings,
    IDictionary<TrimmedRequiredString, DslType> localVariables)
{
    public Token CurrentToken { get; } = currentToken;
    public IExpressionTree? ParsedExpressionOnLeft { get; } = parsedExpressionOnLeft;
    public LinkedList<Token> RemainingTokensOnRight { get; } = remainingTokensOnRight;
    public KeywordToken? PreviousOperator { get; } = previousOperator;
    public ICollection<TrimmedRequiredString> AllWarnings { get; } = allWarnings;
    public IDictionary<TrimmedRequiredString, DslType> LocalVariables { get; } = localVariables;
}
