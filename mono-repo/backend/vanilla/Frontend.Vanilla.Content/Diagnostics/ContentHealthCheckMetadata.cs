#nullable enable

using System;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Diagnostics.Health;

namespace Frontend.Vanilla.Content.Diagnostics;

internal static class ContentHealthCheckMetadata
{
    public static HealthCheckMetadata Create(
        string name,
        string description,
        string whatToDoIfFailed,
        HealthCheckSeverity severity = default)
        => new HealthCheckMetadata(
            "Content - " + name,
            description,
            whatToDoIfFailed,
            severity,
            ContentConfiguration.FeatureName,
            new Uri("https://docs.vanilla.intranet/content-infrastructure.html"));
}
