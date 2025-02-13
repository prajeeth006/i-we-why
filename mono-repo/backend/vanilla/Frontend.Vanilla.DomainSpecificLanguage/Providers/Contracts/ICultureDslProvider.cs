using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides cultures and their details based on DynaCon configuration VanillaFramework.Web.Globalization.
/// NOTE: Values at /health/dsl don't reflect tested browser URL.
/// </summary>
[Description("Provides cultures and their details based on DynaCon configuration VanillaFramework.Web.Globalization."
             + " NOTE: Values at /health/dsl don't reflect tested browser URL.")]
[ValueVolatility(ValueVolatility.Client)]
public interface ICultureDslProvider
{
    /// <summary>Gets configured default .NET culture for current label e.g. en-US.</summary>
    [Description("Gets default .NET culture configured for current label e.g. en-US.")]
    string Default { get; }

    /// <summary>Gets allowed .NET cultures configured for current label and user (hidden cultures) joined with comma e.g. en-US, de-AT.</summary>
    [Description("Gets allowed .NET cultures configured for current label and user (hidden cultures) joined with comma e.g. en-US, de-AT.")]
    string GetAllowed();

    /// <summary>
    /// Gets currently set (resolved) .NET culture corresponding to one selected in the language switcher e.g. de-AT.
    /// The resolution details: <see href="https://docs.vanilla.intranet/articles/features/globalization.html" />.
    /// </summary>
    [Description("Gets currently set (resolved) .NET culture corresponding to one selected in the language switcher e.g. de-AT."
                 + " The resolution details: https://docs.vanilla.intranet/articles/features/globalization.html")]
    string Current { get; }

    /// <summary>
    /// Gets .NET culture from allowed configured ones corresponding to http://api.bwin.com/v3/user/culture claim. Claims are issued by PosAPI.
    /// For logged-in user usually it's the one from settings/registration. Returns empty string if the claim is missing or invalid.
    /// </summary>
    [Description("Gets .NET culture from allowed configured ones corresponding to http://api.bwin.com/v3/user/culture claim. Claims are issued by PosAPI."
                 + " For logged-in user usually it's the one from settings/registration. Returns empty string if the claim is missing or invalid.")]
    string? GetFromClaims();

    /// <summary>
    /// Gets .NET culture from allowed configured ones corresponding to 'Accept-Language' HTTP request header sent by user's browser according to his language preferences.
    /// Returns empty string if there is no corresponding culture.
    /// </summary>
    [Description(
        "Gets .NET culture from allowed configured ones corresponding to 'Accept-Language' HTTP request header sent by user's browser according to his language preferences."
        + " Returns empty string if there is no corresponding culture.")]
    string? GetFromBrowser();

    /// <summary>
    /// Gets .NET culture from allowed configured ones corresponding to 'UserSettings' cookie which is the culture used last time when the user visited this website using particular browser.
    /// Returns empty string if it's first user's visit or culture in the cookie isn't allowed on the label anymore.
    /// </summary>
    [Description(
        "Gets .NET culture from allowed configured ones corresponding to 'UserSettings' cookie which is the culture used last time when the user visited this website using particular browser."
        + " Returns empty string if it's first user's visit or culture in the cookie isn't allowed on the label anymore.")]
    string? GetFromPreviousVisit();

    /// <summary>Gets configured URL token (usually first path segment) for given .NET culture name. Examples: en-US -> en, es-419 -> ex-xl.</summary>
    [Description("Gets configured URL token (usually first path segment) for given .NET culture name. Examples: en-US -> en, es-419 -> ex-xl.")]
    string GetUrlToken(string cultureName);
}
