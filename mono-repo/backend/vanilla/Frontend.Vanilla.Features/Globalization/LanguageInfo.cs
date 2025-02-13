using System.Globalization;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.Globalization;

/// <summary>Contains language related data to run web application.</summary>
public sealed class LanguageInfo : ToStringEquatable<LanguageInfo>
{
    /// <summary>Gets the .NET culture used to create this object.</summary>
    public CultureInfo Culture { get; }

    /// <summary>Gets the native language name used in language switcher. It can't contain multiple subsequent white-spaces in order to be usable in HTML.</summary>
    public TrimmedRequiredString NativeName { get; }

    /// <summary>Gets the token used for ASP.NET and Angular routing as a first segment in URLs. It can contain only lower-case letters, digits, or hyphens in order to produce nice URLs.</summary>
    public TrimmedRequiredString RouteValue { get; }

    /// <summary>Gets the token identifying particular Sitecore content translation.</summary>
    public TrimmedRequiredString SitecoreContentLanguage { get; }

    /// <summary>Gets the token identifying default/fallback Sitecore content translation.</summary>
    public TrimmedRequiredString? SitecoreContentDefaultLanguage { get; }

    /// <summary>Gets the value to be used for 'lang' attribute on &lt;html&gt; element.</summary>
    public TrimmedRequiredString HtmlLangAttribute { get; }

    /// <summary>Gets the value to be used as LOCALE_ID for angular on the frontend.</summary>
    public TrimmedRequiredString AngularLocale { get; }

    /// <summary>Creates a new instance.</summary>
    public LanguageInfo(
        CultureInfo culture,
        string nativeName,
        string routeValue,
        string sitecoreContentLanguage,
        string? sitecoreContentDefaultLanguage,
        string htmlLangAttribute,
        string angularLocale)
    {
        Culture = CultureInfo.ReadOnly(Guard.NotNull(culture, nameof(culture)));
        NativeName = Guard.Requires(
            nativeName,
            n => !Regex.IsMatch(n ?? string.Empty, @"^$|^\s|\s{2}|\s$"),
            nameof(nativeName),
            "NativeName must not be empty, must be trimmed and must not contain multiple subsequent white-spaces in order to be usable in HTML.");
        RouteValue = Guard.SimpleUrlPathSegment(routeValue, nameof(routeValue));
        SitecoreContentLanguage = Guard.TrimmedRequired(sitecoreContentLanguage, nameof(sitecoreContentLanguage));
        SitecoreContentDefaultLanguage = sitecoreContentDefaultLanguage != null
            ? Guard.TrimmedRequired(sitecoreContentDefaultLanguage, nameof(sitecoreContentDefaultLanguage))
            : null;
        HtmlLangAttribute = Guard.TrimmedRequired(htmlLangAttribute, nameof(htmlLangAttribute));
        AngularLocale = Guard.TrimmedRequired(angularLocale, nameof(angularLocale));
    }

    /// <summary>Returns <see cref="Culture" /> name. This allows easy equality comparisons using <see cref="ToStringEquatable{T}" />.</summary>
    public override string ToString() => Culture.ToString();
}
