using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;

namespace Frontend.Vanilla.Features.Globalization.Diagnostics;

/// <summary>
/// See Metadata.
/// </summary>
internal sealed class PosApiSupportedLanguagesHealthCheck(ILanguagesServiceClient languagesServiceClient, IGlobalizationConfiguration globalizationConfig)
    : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "PosAPI Supported Languages",
        description:
        "Checks whether all the languages allowed in Vanilla are supported by PosApi (platform in the end). If failed, a list of unsupported languages is shown.",
        whatToDoIfFailed: "Reduce the amount of allowed languages in the Configuration in DynaCon or add missing languages on PosAPI side.",
        documentationUri: new Uri("https://docs.vanilla.intranet/globalization.html"),
        configurationFeatureName: GlobalizationConfiguration.FeatureName);

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var posApiLanguages = await languagesServiceClient.GetCachedAsync(ExecutionMode.Async(cancellationToken));

        // Unsupported languages are languages allowed in Vanilla but not supported by PosApi
        var unsupportedLangs = globalizationConfig.AllowedLanguages
            .Select(x => x.Culture.Name)
            .Except(posApiLanguages.Select(x => x.CultureName), StringComparer.OrdinalIgnoreCase)
            .ToList();

        return unsupportedLangs.Count > 0
            ? HealthCheckResult.CreateFailed($"These languages are configured in Vanilla but not supported by PosAPI: {unsupportedLangs.Join()}.")
            : HealthCheckResult.Success;
    }
}
