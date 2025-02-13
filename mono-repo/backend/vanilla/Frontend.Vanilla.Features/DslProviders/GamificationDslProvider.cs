using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class GamificationDslProvider : IGamificationDslProvider
{
    public string CoinsBalance()
        => throw new ClientSideOnlyException();
}
