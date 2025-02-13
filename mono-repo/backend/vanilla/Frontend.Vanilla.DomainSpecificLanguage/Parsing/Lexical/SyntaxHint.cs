using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

internal sealed class SyntaxHint
{
    public string HtmlId { get; }
    public IReadOnlyList<Keyword> Keywords { get; }
    public IReadOnlyList<string> KeywordHtmls { get; }
    public string Description { get; }
    public IReadOnlyList<string> ExampleHtmls { get; }

    private SyntaxHint(TrimmedRequiredString htmlId, IEnumerable<Keyword> keywords, TrimmedRequiredString description, IEnumerable<string> examples)
    {
        HtmlId = Guard.Requires(htmlId, id => id.Value.All(c => char.IsLetterOrDigit(c) || c == '-'), nameof(htmlId), "Only letters, digits or hyphen are allowed.");
        Keywords = keywords.ToArray();
        KeywordHtmls = Keywords.Select(k => ToEmphasizedHtml(k.Name, new[] { k.Value.Value })).ToArray();
        Description = description;

        var keywordsToEmphasize = Keywords.ConvertAll(k => k.Value.Value);
        ExampleHtmls = examples.Select(e => !e.Contains("<code>") ? ToEmphasizedHtml(e, keywordsToEmphasize) : e).ToArray();
    }

    public static readonly IReadOnlyList<SyntaxHint> AllHints = new[]
    {
        new SyntaxHint(
            htmlId: "Provider-access",
            keywords: new[] { Keyword.Dot },
            description:
            "Retrieves value of predefined provider property or function. See full list below. Provider name is separated by a dot from property/function name.",
            examples: new[] { "User.LoginName", "QueryString.Get('trackerId')" }),

        new SyntaxHint(
            htmlId: "String-literals",
            keywords: Array.Empty<Keyword>(),
            description:
            "String literals used to specify constant values. You can use either single or double quotes and then the other type of quotes can be used inside the string.",
            examples: new[] { "<code>&apos;</code>Hello there &quot;:)<code>&apos;</code>", "<code>&quot;</code>General &apos;Kenobi&apos;<code>&quot;</code>" }),

        new SyntaxHint(
            htmlId: "Number-literals",
            keywords: new[] { Keyword.Dot },
            description:
            "Number literals used to specify constant values. They can be negative when prefixed with minues and they can contain decimal part separated by dot.",
            examples: new[] { "66", "-1.23" }),

        new SyntaxHint(
            htmlId: "Boolean-literals",
            keywords: new[] { Keyword.True, Keyword.False },
            description: "Boolean literals used to specify constant values. Used e.g. in configs to always enable/disable something.",
            examples: new[] { "TRUE", "FALSE" }),

        new SyntaxHint(
            htmlId: "Local-variables",
            keywords: new[] { Keyword.VariableAssignment },
            description:
            "Local variable assignment with variable name on the left and value expression on the right. Variable type is determined based on the type of assigned expression. It must stay same in entire expression.",
            examples: new[] { "starship := 'USS Enterprise (NCC-1701)'" }),

        new SyntaxHint(
            htmlId: "Parentheses",
            keywords: new[] { Keyword.LeftParenthesis, Keyword.RightParenthesis },
            description: "Used to enclose list of paramters for function call or inner expression to remove ambiguity.",
            examples: new[]
            {
                "List.Contains('Heroes', 'Batman')",
                "User.IsKnown OR (User.LoggedIn AND User.FirstLogin)",
            }),

        new SyntaxHint(
            htmlId: "Comma",
            keywords: new[] { Keyword.Comma },
            description: "Used to separate function parameter or list items.",
            examples: new[]
            {
                "List.Contains('Heroes', 'Batman')",
                "Request.CultureToken IN ['en', 'de']",
            }),

        new SyntaxHint(
            htmlId: "Square-brackets",
            keywords: new[] { Keyword.In, Keyword.LeftSquareBracket, Keyword.RightSquareBracket },
            description: "Binary operator used to test if left operand value is contained in the list of values on the right enclosed by square brackets."
                         + " All values must be of the same type. All non-void types are supported.",
            examples: new[] { "User.LoginName IN ['Batman', 'Joker']" }),

        new SyntaxHint(
            htmlId: "Equality",
            keywords: new[] { Keyword.Equality, Keyword.Inequality },
            description: "Binary operator used to check if two operands are equal or not. Operands must be of same type. All non-void types are supported.",
            examples: new[] { "User.VisitCount = 7", "1 <> 2" }),

        new SyntaxHint(
            htmlId: "Comparison",
            keywords: new[] { Keyword.Less, Keyword.LessOrEqual, Keyword.Greater, Keyword.GreaterOrEqual },
            description: "Binary operator used to compare two numeric operands.",
            examples: new[] { "User.VisitCount > 10", "1 >= 0", "2 < 10", "3 <= 2" }),

        new SyntaxHint(
            htmlId: "And",
            keywords: new[] { Keyword.And },
            description: "Binary operator which evalutes to true if both operands are true.",
            examples: new[] { "User.LoggedIn AND (User.VisitCount > 10)" }),

        new SyntaxHint(
            htmlId: "Or",
            keywords: new[] { Keyword.Or },
            description: "Binary operator. If used between two booleans then evalutes to true if at least one of them if true."
                         + " If used between two strings and left one isn't empty then evalutes to it."
                         + " If used between two numbers and left one isn't minus one then evalutes to it."
                         + " Otherwise evaluates to right operand.",
            examples: new[] { "User.LoggedIn OR (User.VisitCount > 10)", "User.LoginName OR 'Batman'", "User.DaysRegistered OR 0" }),

        new SyntaxHint(
            htmlId: "Not",
            keywords: new[] { Keyword.Not },
            description: "Prefix operator which computes logical negation of its boolean operand.",
            examples: new[] { "NOT User.LoggedIn" }),

        new SyntaxHint(
            htmlId: "Matches",
            keywords: new[] { Keyword.Matches },
            description: "Binary operator used to test that left string matches regular expression string on the right.",
            examples: new[] { "Request.AbsolutePath MATCHES '^/(en|de)/login$'" }),

        new SyntaxHint(
            htmlId: "Contains",
            keywords: new[] { Keyword.Contains },
            description: "Binary operator used to test that left string contains string on the right as a substring.",
            examples: new[] { "Request.AbsolutePath CONTAINS 'login'" }),

        new SyntaxHint(
            htmlId: "Starts-or-ends-with",
            keywords: new[] { Keyword.StartsWith, Keyword.EndsWith },
            description: "Binary operator used to test that left string starts/ends with string on the right.",
            examples: new[] { "Request.AbsolutePath STARTS-WITH '/en/'", "Request.AbsolutePath ENDS-WITH '/login'" }),

        new SyntaxHint(
            htmlId: "Length",
            keywords: new[] { Keyword.Length },
            description: "Unary operator used to determine length of given string.",
            examples: new[] { "LENGTH 'bwin'", "LENGTH User.LoginName" }),

        new SyntaxHint(
            htmlId: "Index-of",
            keywords: new[] { Keyword.IndexOf, Keyword.LastIndexOf },
            description:
            "Binary operator which reports the zero-based index of the first/last occurrence of a string on the right within a string on the left. It returns -1 if no occurrence is found.",
            examples: new[] { "'bw_ChuckNorris' INDEX-OF '_'", "'/en/sports/page' LAST-INDEX-OF '/'" }),

        new SyntaxHint(
            htmlId: "Substring-from",
            keywords: new[] { Keyword.SubstringFrom, Keyword.Take },
            description:
            "Retrieves a substring from string on the left. The substring starts at a specified character index and continues to the end or TAKEs specified number of characters."
            + " If start index is negative then it's applied from the end. If index or length are out of bounds then empty string is returned."
            + " In general logic is as same as in JavaScript.",
            examples: new[]
            {
                "'Chuck Norris' SUBSTRING-FROM 6 = 'Norris'",
                "'Chuck Norris' SUBSTRING-FROM 6 TAKE 2 = 'No'",
                "'Bwin Party' SUBSTRING-FROM -5 = 'Party'",
                "'Bwin Party' TAKE 4 = 'Bwin'",
            }),

        new SyntaxHint(
            htmlId: "Letter-casing",
            keywords: new[] { Keyword.LowerCase, Keyword.UpperCase },
            description: "Prefix operator which converts string operand to lower/upper cased string.",
            examples: new[] { "LOWERCASE User.LoginName = 'BATMAN'", "UPPERCASE User.LoginName = 'joker'" }),

        new SyntaxHint(
            htmlId: "Number-cast",
            keywords: new[] { Keyword.Number },
            description: "Prefix operator which parses string operand to a number. If string isn't a valid number then it fails.",
            examples: new[] { "(NUMBER Claims.Get('workflowType')) > 7" }),

        new SyntaxHint(
            htmlId: "String-cast",
            keywords: new[] { Keyword.String },
            description: "Prefix operator which converts numeric operand to a string.",
            examples: new[] { "(STRING Balance.AccountBalance) + ' EUR'" }),

        new SyntaxHint(
            htmlId: "Trim",
            keywords: new[] { Keyword.Trim },
            description: "Prefix operator which evalutes string operand to a string without leading and trailing white-spaces e.g. spaces, new-lines, tabs.",
            examples: new[] { "(TRIM ' a b ') = 'a b'" }),

        new SyntaxHint(
            htmlId: "Addition",
            keywords: new[] { Keyword.Addition },
            description: "Binary operator which can be used between two number operands or two string operands."
                         + " If used with numbers then it computes the sum of its operands."
                         + " If used with strings then it concatenats them into one string.",
            examples: new[] { "User.VisitCount + 10", "'bw_' + User.LoginName" }),

        new SyntaxHint(
            htmlId: "Subtraction",
            keywords: new[] { Keyword.Subtraction },
            description: "Binary operator which subtracts number on the right from number on the left.",
            examples: new[] { "User.VisitCount - 10" }),

        new SyntaxHint(
            htmlId: "Multiplication",
            keywords: new[] { Keyword.Multiplication },
            description: "Binary operator which computes the product of its numeric operands.",
            examples: new[] { "User.VisitCount * 2" }),

        new SyntaxHint(
            htmlId: "Division",
            keywords: new[] { Keyword.Division },
            description: "Binary operator which divides number on the left by then number on the right.",
            examples: new[] { "User.VisitCount / 2" }),

        new SyntaxHint(
            htmlId: "Modulo",
            keywords: new[] { Keyword.Modulo },
            description: "Binary operator which computes the remainder after dividing number on the left by number on the right.",
            examples: new[] { "(User.VisitCount % 2) = 1" }),

        new SyntaxHint(
            htmlId: "Round",
            keywords: new[] { Keyword.Round },
            description: "Prefix operator which rounds numeric operand to the nearest integer.",
            examples: new[] { "ROUND Balance.AccountBalance" }),

        new SyntaxHint(
            htmlId: "Floor",
            keywords: new[] { Keyword.Floor },
            description: "Prefix operator which converts numeric operand to the largest integer less than or equal to it.",
            examples: new[] { "FLOOR Balance.AccountBalance" }),

        new SyntaxHint(
            htmlId: "Ceil",
            keywords: new[] { Keyword.Ceil },
            description: "Prefix operator which converts numeric operand to the smallest integer greater than or equal to it.",
            examples: new[] { "CEIL Balance.AccountBalance" }),

        new SyntaxHint(
            htmlId: "If-then-else",
            keywords: new[] { Keyword.If, Keyword.Then, Keyword.ElseIf, Keyword.Else, Keyword.End },
            description: "Construct with a boolean condition, body of void statements, and optional alternative void statements."
                         + " If condition evaluates to true then body statements are executed."
                         + " Otherwise alternative statements are executed if defined."
                         + $" Subsequent if-then-else constructs can be merged together using {Keyword.ElseIf} so that they are on same level and closed once.",
            examples: new[]
            {
                "IF User.LoggedIn THEN\r\n"
                + "\tCookies.SetSession('a', 'b')\r\n"
                + "END",

                "IF User.LoggedIn THEN\r\n"
                + "\tCookies.SetSession('a', 'b')\r\n"
                + "ELSE-IF User.IsKnown THEN\r\n"
                + "\tCookies.SetSession('a', 'c')\r\n"
                + "ELSE\r\n"
                + "\tCookies.SetSession('a', 'd')\r\n"
                + "END",
            }),

        new SyntaxHint(
            htmlId: "Ternary-conditional-operation",
            keywords: new[] { Keyword.QuestionMark, Keyword.Colon },
            description:
            "Ternary conditional operation which if boolean condition (before question mark) is true then evalutes to consequent expression (operand after question mark)."
            + " Otherwise it evaluates to alternative expression (operand after colon)."
            + " Operands (consequent and alternative) can be both strings or numbers.",
            examples: new[] { "User.LoggedIn ? User.LoginName : '(anonymous)'" }),

        new SyntaxHint(
            htmlId: "UrlEncode",
            keywords: new[] { Keyword.UrlEncode },
            description: "Prefix operator which converts the string operand to a Url encoded string.",
            examples: new[] { "(URL-ENCODE ' a b ') = '%20a%20b%20'" }),

        new SyntaxHint(
            htmlId: "UrlDecode",
            keywords: new[] { Keyword.UrlDecode },
            description: "Prefix operator which converts the string operand to a Url decoded string.",
            examples: new[] { "(URL-DECODE '%20a%20b%20') = ' a b '" }),
    };

    private static string ToEmphasizedHtml(string str, IEnumerable<string> substringsToEphasize)
    {
        var html = HttpUtility.HtmlEncode(str)
            .Replace("\r\n", "<br />")
            .Replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");

        foreach (var toEmphasize in substringsToEphasize)
        {
            var quoted = HttpUtility.HtmlEncode($"'{toEmphasize}'");
            var search = html.Contains(quoted) ? quoted : HttpUtility.HtmlEncode(toEmphasize);
            html = html.Replace(search, $"<code>{HttpUtility.HtmlEncode(toEmphasize)}</code>");
        }

        return html;
    }
}
