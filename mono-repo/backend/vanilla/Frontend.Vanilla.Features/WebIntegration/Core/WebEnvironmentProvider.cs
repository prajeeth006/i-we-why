using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.WebIntegration.Core;

/// <summary>
/// Implementation of <see cref="IEnvironmentProvider" /> for web applications.
/// </summary>
internal sealed class WebEnvironmentProvider(
    ICurrentTenantResolver currentTenantResolver,
    IEnvironmentNameProvider environmentNameProvider,
    ISingleDomainAppConfiguration singleDomainAppConfig)
    : IEnvironmentProvider
{
    // These values are immutable -> copy them to release inner dependencies
    public TrimmedRequiredString Environment { get; } = environmentNameProvider.EnvironmentName;
    public bool IsProduction { get; } = environmentNameProvider.IsProduction;
    public bool IsSingleDomainApp { get; } = singleDomainAppConfig.IsEnabled();

    public TrimmedRequiredString CurrentLabel
        => currentTenantResolver.ResolveName();

    public TrimmedRequiredString CurrentDomain
        => currentTenantResolver.ResolveDomain();
}
