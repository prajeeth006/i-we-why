using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

/// <summary>
/// Defines a lexical token (word or combination of characters) in Vanilla DSL.
/// </summary>
internal abstract class Token(int position) : ToStringEquatable<Token>
{
    public int Position { get; } = Guard.GreaterOrEqual(position, 0, nameof(position));
}

internal sealed class KeywordToken(int position, Keyword keyword) : Token(position)
{
    public Keyword Keyword { get; } = keyword;

    public override string ToString()
        => $"{Keyword} at position {Position}";
}

internal abstract class ValueToken<TValue>(int position, TValue value) : Token(position)
    where TValue : notnull
{
    public TValue Value { get; } = value;

    public override string ToString()
        => $"{GetType().Name.RemoveSuffix(nameof(Token)).Replace("L", " l")} {Value.Dump()} at position {Position}";
}

internal sealed class NumberLiteralToken(int position, decimal value) : ValueToken<decimal>(position, value) { }

internal sealed class StringLiteralToken(int position, string value) : ValueToken<string>(position, value) { }

internal sealed class IdentifierToken(int position, string value) : ValueToken<Identifier>(position, new Identifier(value)) { }
