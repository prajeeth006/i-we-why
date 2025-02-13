#nullable enable

using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Diagnostics;

/// <summary>
/// Checks health of Sitecore REST service. If failed then exception already contains all necessary details.
/// </summary>
internal sealed class SitecoreContentHealthCheck(IContentRequestFactory requestFactory, IContentXmlSource xmlSource) : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = ContentHealthCheckMetadata.Create(
        name: "Sitecore Service",
        description: "Checks connectivity to Sitecore REST service by retrieving the root content node as configured.",
        whatToDoIfFailed: "Check the connectivity, the Configuration and Sitecore itself.",
        severity: HealthCheckSeverity.Critical);

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var request = requestFactory.Create("/");
        var content = await xmlSource.GetContentXmlAsync(ExecutionMode.Async(cancellationToken), request.ItemUrl, useCache: false, trace: null);

        return HealthCheckResult.CreateSuccess(new
        {
            RequestUrl = request.ItemUrl,
            Response = MessageUtil.Truncate(content.Xml?.ToString(SaveOptions.DisableFormatting | SaveOptions.OmitDuplicateNamespaces), maxLength: 200),
        });
    }
}
