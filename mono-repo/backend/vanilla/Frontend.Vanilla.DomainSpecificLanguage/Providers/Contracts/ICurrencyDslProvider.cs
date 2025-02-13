using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides currency formatting
/// NOTE: Values at /health/dsl don't reflect tested browser URL.
/// </summary>
[Description("Provides currency formatting")]
[ValueVolatility(ValueVolatility.Client)]
public interface ICurrencyDslProvider
{
    /// <summary>Gets currency symbol for user currency code.</summary>
    [Description("Gets the currency symbol")]
    [ClientSideOnly]
    string Symbol { get; }

    /// <summary>Formats specified amounts according to configuration <c>https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Web.UI&amp;key=CurrencyDisplay</c>
    /// Usages:
    /// Currency.Format("EUR | 10, GBP | 10, USD | 15")   -----> $15 (when user currency is USD).
    /// Currency.Format(10)  ----> £10 (when user currency is GPB).
    /// Currency.Symbol     ----> € (when user currency is EUR).
    ///
    /// </summary>
    [Description(@"Formats specified amounts according to currency code specified, matching user currency code.
        Accepted params are in following format: 1 or many Key values as string separated by comma ('EUR | 10, GBP | 10, USD | 15'), Amount as string ('15')")]
    [ClientSideOnly]
    string Format(string currencyValues);
}
