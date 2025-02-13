using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.Header;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class EpcotDslProvider(IHeaderConfiguration headerConfiguration, IAccountMenuConfiguration accountMenuConfiguration)
    : IEpcotDslProvider
{
    public bool IsEnabled(string featureName)
    {
        return featureName?.ToLower() switch
        {
            "header" => headerConfiguration.Version == 2,
            "accountmenu" => accountMenuConfiguration.Version == 4,
            _ => false,
        };
    }
}
