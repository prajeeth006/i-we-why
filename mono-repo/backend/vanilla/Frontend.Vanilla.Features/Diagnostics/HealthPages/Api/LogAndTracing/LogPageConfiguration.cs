using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;

internal interface ILogPageConfiguration
{
    string KibanaCorrelationSearchUrlTemplate { get; }
}

internal sealed class LogPageConfiguration : ILogPageConfiguration
{
    public const string FeatureName = "VanillaFramework.Diagnostics.Log";
    public const string CorrelationIdPlaceholder = "${correlationId}";

    [Required]
    [RegularExpression(@".*\" + CorrelationIdPlaceholder + ".*")]
    public string KibanaCorrelationSearchUrlTemplate { get; set; } = "";
}
