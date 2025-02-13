#nullable disable

using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Host.Features.Redirex;

/// <summary>
/// Configuration for redirex.
/// </summary>
internal interface IRedirexConfiguration
{
    bool Enabled { get; }
    bool IgnoreGlobalHttpsRedirect { get; }
    bool ForceUsageOfDisabledRepository { get; }
    bool SslOffloadingMode { get; }
    Uri ServiceUrl { get; }

    TimeSpan RequestTimeout { get; }
}

internal sealed class RedirexConfiguration : IRedirexConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Redirex";

    public bool Enabled { get; set; }
    public bool IgnoreGlobalHttpsRedirect { get; set; }
    public bool ForceUsageOfDisabledRepository { get; set; }
    public bool SslOffloadingMode { get; set; }

    [Required]
    public Uri ServiceUrl { get; set; }

    [MinimumTimeSpan("00:00:00.1")]
    public TimeSpan RequestTimeout { get; set; }
}
