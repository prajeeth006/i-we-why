using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

/// <summary>
/// Parses which does lexical analysis hence breaks the expression to tokens.
/// </summary>
internal interface ILexicalParser
{
    IEnumerable<Token> Parse(RequiredString expression);
}

internal sealed class LexicalParser : ILexicalParser
{
    public IEnumerable<Token> Parse(RequiredString expression)
    {
        var index = 0;

        while (index < expression.Value.Length)
        {
            if (char.IsWhiteSpace(expression.Value[index]))
            {
                index++;

                continue; // Just swallow white-spaces
            }

            var result = TryParseKeywordToken(expression, index)
                         ?? TryParseIdentifier(expression, index)
                         ?? TryParseStringLiteral(expression, index)
                         ?? TryParseNumberLiteral(expression, index)
                         ?? throw new ParseException(index, "Unrecognized token detected.");

            yield return result.Token;

            index += result.ParsedLength;
        }
    }

    private static (Token Token, int ParsedLength)? TryParseNumberLiteral(string expression, int index)
    {
        if (!char.IsDigit(expression[index]))
            return null;

        var rawValue = expression.SubstringWhile(index, char.IsDigit);
        var nextChar = expression.ElementAtOrDefault(index + rawValue.Length);

        if (nextChar == '.')
        {
            rawValue += "." + expression.SubstringWhile(index + rawValue.Length + 1, char.IsDigit);
            nextChar = expression.ElementAtOrDefault(index + rawValue.Length);
        }

        if (rawValue.LastChar() == '.')
            throw new ParseException(index, "Number ends with a dot but it's missing decimal part.");
        if (nextChar == '.')
            throw new ParseException(index, "Numbers can contain only one dot to separate decimal part.");
        if (Identifier.IsValidChar(nextChar))
            throw new ParseException(index, "Numbers must be separated by a space from an identifier. Also identifiers can't start with a digit.");
        if (!DslNumber.TryParse(rawValue, out var value))
            throw new ParseException(index, $"Failed to parse a valid number from string '{rawValue}'.");

        return (new NumberLiteralToken(index, value), rawValue.Length);
    }

    private static (Token Token, int ParsedLength)? TryParseStringLiteral(string expression, int index)
    {
        if (!expression[index].EqualsAny('\'', '"'))
            return null;

        var quote = expression[index];
        var closingIndex = expression.IndexOf(quote, index + 1);

        if (closingIndex < 0)
            throw new ParseException(index, $"Unclosed string literal opened by {(quote == '"' ? "double" : "single")} quote. It must be closed by the same one.");

        var length = closingIndex + 1 - index;
        var value = expression.Substring(index + 1, length - 2); // Without quotes

        return (new StringLiteralToken(index, value), length);
    }

    private static (Token Token, int ParsedLength)? TryParseIdentifier(string expression, int index)
    {
        if (!char.IsLetter(expression[index]))
            return null;

        var value = expression.SubstringWhile(index, Identifier.IsValidChar);

        return (new IdentifierToken(index, value), value.Length);
    }

    private static (Token Token, int ParsedLength)? TryParseKeywordToken(string expression, int index)
    {
        var subExpr = expression.Substring(index);

        foreach (var keyword in Keyword.AllKeywords)
            if (subExpr.StartsWith(keyword.Value))
            {
                // If textual keyword -> should not be followed by text
                if (char.IsLetter(subExpr[0]) && Identifier.IsValidChar(subExpr.ElementAtOrDefault(keyword.Value.Value.Length)))
                    throw new ParseException(index, $"Keyword '{keyword.Value}' is immediately followed by unexpected identifier.");

                return (new KeywordToken(index, keyword), keyword.Value.Value.Length);
            }

        return null;
    }
}
