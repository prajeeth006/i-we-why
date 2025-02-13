using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Ioc;

namespace Frontend.Vanilla.Features.Diagnostics.Health;

/// <summary>
/// Validates properties and dependencies of registered health checks.
/// </summary>
internal sealed class HealthCheckValidationTask(IEnumerable<IHealthCheck> checks, IEnumerable<IConfigurationInfo> configs) : LambdaBootTask(() =>
{
    var checkedNames = new Dictionary<TrimmedRequiredString, IHealthCheck>(RequiredStringComparer.OrdinalIgnoreCase);
    var featureNames = configs.Select(c => c.FeatureName).ToHashSet<TrimmedRequiredString>(RequiredStringComparer.OrdinalIgnoreCase);

    foreach (var check in checks)
        try
        {
            if (check.Metadata == null)
                throw new Exception("Metadata property is null.");

            // TODO: Check this logic
            if (!ReferenceEquals(check.Metadata, check.Metadata))
                throw new Exception("Metadata property isn't a singleton. It created a new unnecessary instance on each get.");

            if (checkedNames.TryGetValue(check.Metadata.Name, out var conflict))
                throw new Exception($"Metadata.Name '{check.Metadata.Name}' is also used by {conflict}.");
            else
                checkedNames[check.Metadata.Name] = check;

            if (check.Metadata.ConfigurationFeatureName != null && !featureNames.Contains(check.Metadata.ConfigurationFeatureName))
                throw new Exception($"Metadata.ConfigurationFeatureName refers to non-existent feature '{check.Metadata.ConfigurationFeatureName}'."
                                    + $" Existing features are: {featureNames.Join()}.");
        }
        catch (Exception ex)
        {
            throw new Exception($"Health check {check} isn't programmed correctly. Fix it according to inner exception.", ex);
        }

    return Task.CompletedTask;
}) { }
