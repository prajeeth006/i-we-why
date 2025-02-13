using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.WebIntegration;

internal interface ISingleDomainAppConfiguration
{
    bool IsEnabled();
}

internal sealed class SingleDomainAppConfiguration(IConfiguration configuration) : ISingleDomainAppConfiguration
{
    public bool IsEnabled()
        => ConfigurationUtil.Get<bool>(configuration, "SingleDomainApp");
}
