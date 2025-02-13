using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.DynaConVariationContext;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Frontend.Vanilla.Features.WebIntegration;

namespace Frontend.Host;

/// <summary>
/// Provides host paths for host config variation context.
/// </summary>
internal sealed class HostPathDynaConProvider(IHttpContextAccessor httpContextAccessor, ISingleDomainAppConfiguration singleDomainAppConfiguration, ISingleDomainHostPathResolver singleDomainHostPathResolver, IHostPathResolver hostPathResolver) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "HostPath";
    public TrimmedRequiredString DefaultValue { get; } = HostPath.Unknown.ToString();

    public string GetCurrentRawValue()
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
            return DefaultValue;

        return singleDomainAppConfiguration.IsEnabled() ? singleDomainHostPathResolver.Resolve(httpContext) : hostPathResolver.Resolve();
    }
}
