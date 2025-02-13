using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.Diagnostics;

/// <summary>
/// Configuration of the global Javascript error handler.
/// </summary>
internal interface IGlobalJavascriptErrorHandlerConfiguration : IDisableableConfiguration
{
    TimeSpan DebounceInterval { get; }
    int MaxErrorsPerBatch { get; }
    IDictionary<string, Regex?> DisableLogLevels { get; }
}

internal class GlobalJavascriptErrorHandlerConfiguration : IGlobalJavascriptErrorHandlerConfiguration
{
    public const string FeatureName = "VanillaFramework.Diagnostics.GlobalJavascriptErrorHandler";

    public bool IsEnabled { get; set; }
    public TimeSpan DebounceInterval { get; set; }
    public int MaxErrorsPerBatch { get; set; }
    public IDictionary<string, Regex?> DisableLogLevels { get; set; } = new Dictionary<string, Regex?>();
}
