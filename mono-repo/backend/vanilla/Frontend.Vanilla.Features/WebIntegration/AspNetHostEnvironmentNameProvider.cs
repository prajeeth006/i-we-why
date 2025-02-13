using Frontend.Vanilla.Features.WebIntegration.Core;
using Microsoft.Extensions.Hosting;

namespace Frontend.Vanilla.Features.WebIntegration;

internal sealed class AspNetHostEnvironmentNameProvider(IHostEnvironment hostEnvironment) : EnvironmentNameProviderBase(hostEnvironment.EnvironmentName.ToLower())
{
    // Lowercase to keep Sitecore and Dynacon DSLs working as Environment was set uppercase on servers.
}
