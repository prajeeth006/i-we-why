using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class CurrencyDslProvider : ICurrencyDslProvider
{
    public string Symbol
        => throw new ClientSideOnlyException();

    public string Format(string currencyValues)
        => throw new ClientSideOnlyException();
}
