using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.SmartBanner;

internal interface ISmartBannerConfiguration
{
    IDslExpression<bool> IsEnabled { get; }
    string AppId { get; }
    decimal MinimumRating { get; }
    int DisplayCounter { get; }
    ApiForDataSource ApiForDataSource { get; }
}

internal class SmartBannerConfiguration(IDslExpression<bool> isEnabled, string appId, decimal minimumRating, int displayCounter, ApiForDataSource apiForDataSource)
    : ISmartBannerConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.SmartBanner";

    [Required]
    public IDslExpression<bool> IsEnabled { get; set; } = isEnabled;

    public string AppId { get; set; } = appId;
    public decimal MinimumRating { get; set; } = minimumRating;
    public int DisplayCounter { get; set; } = displayCounter;

    [DefinedEnumValue]
    public ApiForDataSource ApiForDataSource { get; set; } = apiForDataSource;
}

internal enum ApiForDataSource
{
    PosApi,
    Sitecore,
}
