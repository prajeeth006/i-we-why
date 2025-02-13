using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

/// <summary>
/// Constant reserved word or sign in Vanilla DSL with a special meaning.
/// </summary>
internal sealed class Keyword
{
    public TrimmedRequiredString Value { get; }
    public TrimmedRequiredString Name { get; }

    private Keyword(TrimmedRequiredString value, TrimmedRequiredString name)
    {
        Value = value;
        Name = name;
    }

    public override string ToString() => Name;

    public static readonly Keyword True = new Keyword("TRUE", "TRUE literal");
    public static readonly Keyword False = new Keyword("FALSE", "FALSE literal");
    public static readonly Keyword Dot = new Keyword(".", "Dot '.'");
    public static readonly Keyword VariableAssignment = new Keyword(":=", "Variable assignment ':='");
    public static readonly Keyword Comma = new Keyword(",", "Comma ','");
    public static readonly Keyword LeftParenthesis = new Keyword("(", "Left parenthesis '('");
    public static readonly Keyword RightParenthesis = new Keyword(")", "Right parenthesis ')'");
    public static readonly Keyword LeftSquareBracket = new Keyword("[", "Left square bracket '['");
    public static readonly Keyword RightSquareBracket = new Keyword("]", "Right square bracket ']'");
    public static readonly Keyword Equality = new Keyword("=", "Equality operator '='");
    public static readonly Keyword Inequality = new Keyword("<>", "Inequality operator '<>'");
    public static readonly Keyword Less = new Keyword("<", "Less-than operator '<'");
    public static readonly Keyword LessOrEqual = new Keyword("<=", "Less-than-or-equal-to operator '<='");
    public static readonly Keyword Greater = new Keyword(">", "Greater-than operator '>'");
    public static readonly Keyword GreaterOrEqual = new Keyword(">=", "Greater-than-or-equal-to operator '>='");
    public static readonly Keyword And = new Keyword("AND", "AND operator");
    public static readonly Keyword Or = new Keyword("OR", "OR operator");
    public static readonly Keyword Not = new Keyword("NOT", "NOT operator");
    public static readonly Keyword In = new Keyword("IN", "IN operator");
    public static readonly Keyword Matches = new Keyword("MATCHES", "MATCHES operator");
    public static readonly Keyword Contains = new Keyword("CONTAINS", "CONTAINS operator");
    public static readonly Keyword StartsWith = new Keyword("STARTS-WITH", "STARTS-WITH operator");
    public static readonly Keyword EndsWith = new Keyword("ENDS-WITH", "ENDS-WITH operator");
    public static readonly Keyword LowerCase = new Keyword("LOWERCASE", "LOWERCASE operator");
    public static readonly Keyword UpperCase = new Keyword("UPPERCASE", "UPPERCASE operator");
    public static readonly Keyword Length = new Keyword("LENGTH", "LENGTH operator");
    public static readonly Keyword IndexOf = new Keyword("INDEX-OF", "INDEX-OF operator");
    public static readonly Keyword LastIndexOf = new Keyword("LAST-INDEX-OF", "LAST-INDEX-OF operator");
    public static readonly Keyword SubstringFrom = new Keyword("SUBSTRING-FROM", "SUBSTRING-FROM operator");
    public static readonly Keyword Take = new Keyword("TAKE", "TAKE operator");
    public static readonly Keyword Number = new Keyword("NUMBER", "NUMBER cast operator");
    public static readonly Keyword String = new Keyword("STRING", "STRING cast operator");
    public static readonly Keyword Trim = new Keyword("TRIM", "TRIM operator");
    public static readonly Keyword Addition = new Keyword("+", "Addition operator '+'");
    public static readonly Keyword Subtraction = new Keyword("-", "Subtraction operator '-'");
    public static readonly Keyword Multiplication = new Keyword("*", "Multiplication operator '*'");
    public static readonly Keyword Division = new Keyword("/", "Division operator '/'");
    public static readonly Keyword Modulo = new Keyword("%", "Modulo operator '%'");
    public static readonly Keyword Round = new Keyword("ROUND", "ROUND operator");
    public static readonly Keyword Floor = new Keyword("FLOOR", "FLOOR operator");
    public static readonly Keyword Ceil = new Keyword("CEIL", "CEIL operator");
    public static readonly Keyword If = new Keyword("IF", "IF keyword");
    public static readonly Keyword Then = new Keyword("THEN", "THEN keyword");
    public static readonly Keyword Else = new Keyword("ELSE", "ELSE keyword");
    public static readonly Keyword ElseIf = new Keyword("ELSE-IF", "ELSE-IF keyword");
    public static readonly Keyword End = new Keyword("END", "END keyword");
    public static readonly Keyword QuestionMark = new Keyword("?", "Question mark '?'");
    public static readonly Keyword Colon = new Keyword(":", "Colon ':'");
    public static readonly Keyword UrlEncode = new Keyword("URL-ENCODE", "URL-ENCODE operator");
    public static readonly Keyword UrlDecode = new Keyword("URL-DECODE", "URL-DECODE operator");

    public static readonly IReadOnlyList<Keyword> AllKeywords = typeof(Keyword)
        .GetFields(BindingFlags.Static | BindingFlags.Public)
        .Where(f => f.FieldType == typeof(Keyword))
        .Select(f => (Keyword)f.GetValue(null)!)
        .OrderByDescending(t => t.Value.Value.Length) // Operator <= should precede <
        .ToArray();
}
