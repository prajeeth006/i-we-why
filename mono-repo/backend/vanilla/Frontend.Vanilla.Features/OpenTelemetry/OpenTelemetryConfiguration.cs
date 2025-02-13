using System.Collections.Generic;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal interface IOpenTelemetryConfiguration
{
    IReadOnlyDictionary<string, Regex> AllowedPathsIncoming { get; }
    bool SendErrorLogs { get; }
}

internal sealed class OpenTelemetryConfiguration : IOpenTelemetryConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.OpenTelemetry";
    public required IReadOnlyDictionary<string, Regex> AllowedPathsIncoming { get; set; }
    public bool SendErrorLogs { get; set; }
}
