using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal interface IRtmsLayerConfiguration
{
    bool IsCashierRedirectEnabled { get; }
    int ToastShowTime { get; }
    int ToastShowInterval { get; }
    string CasinoGameLaunchUrl { get; }
    string CasinoUriScheme { get; }
    string BonusSectionTemplate { get; }
    bool ShowCloseButtonOnBonusTeaser { get; }
    IDictionary<string, string> BonusSectionByTemplateId { get; }
    HttpUri BonusTeaserRedirectUrl { get; }
    bool EnableToastStacking { get; }
    int Version { get; }
}

internal sealed class RtmsLayerConfiguration(
    int toastShowTime,
    int toastShowInterval,
    string casinoGameLaunchUrl,
    string casinoUriScheme,
    string bonusSectionTemplate,
    bool showCloseButtonOnBonusTeaser,
    IDictionary<string, string> bonusSectionByTemplateId,
    HttpUri bonusTeaserRedirectUrl,
    bool enableToastStacking,
    int version,
    bool isCashierRedirectEnabled)
    : IRtmsLayerConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.RtmsLayer";

    public bool IsCashierRedirectEnabled { get; } = isCashierRedirectEnabled;
    public int ToastShowTime { get; set; } = toastShowTime;
    public int ToastShowInterval { get; set; } = toastShowInterval;
    public string CasinoGameLaunchUrl { get; set; } = casinoGameLaunchUrl;
    public string CasinoUriScheme { get; set; } = casinoUriScheme;
    public string BonusSectionTemplate { get; set; } = bonusSectionTemplate;
    public bool ShowCloseButtonOnBonusTeaser { get; set; } = showCloseButtonOnBonusTeaser;
    public IDictionary<string, string> BonusSectionByTemplateId { get; set; } = bonusSectionByTemplateId;
    public HttpUri BonusTeaserRedirectUrl { get; set; } = bonusTeaserRedirectUrl;
    public bool EnableToastStacking { get; set; } = enableToastStacking;
    public int Version { get; set; } = version;
}
