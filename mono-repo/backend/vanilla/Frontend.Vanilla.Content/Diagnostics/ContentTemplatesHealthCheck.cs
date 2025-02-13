using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Diagnostics;

/// <summary>
/// Checks that templates from Sitecore service correspond to compiled code of this app.
/// </summary>
internal sealed class ContentTemplatesHealthCheck(
    IReflectionTemplatesSource reflectionTemplatesSource,
    ISitecoreServiceTemplatesSource sitecoreServiceTemplatesSource,
    IContentTemplatesComparer comparer)
    : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = ContentHealthCheckMetadata.Create(
        name: "Templates",
        description: "Checks that templates from Sitecore service correspond to compiled code of this app.",
        whatToDoIfFailed:
        "Fix access to Sitecore if failing. Add/fix/restore templates/fields/differences on Sitecore side or regenerate templates in the code and roll it out.");

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var trace = new List<string>();

        try
        {
            var sitecoreTemplates = await sitecoreServiceTemplatesSource.GetTemplatesAsync(ExecutionMode.Async(cancellationToken), trace.Add, verbose: false);

            var differences = comparer.Compare(reflectionTemplatesSource.Templates, sitecoreTemplates).ToList();
            var errors = differences.Where(d => d.IsCritical).Select(d => d.Message).ToList();
            var details = new
            {
                SitecoreServiceTrace = trace,
                Warnings = differences.Where(d => !d.IsCritical).Select(d => d.Message).ToList(),
            };

            return errors.Count == 0
                ? HealthCheckResult.CreateSuccess(details)
                : HealthCheckResult.CreateFailed(errors, details);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex, trace);
        }
    }
}
