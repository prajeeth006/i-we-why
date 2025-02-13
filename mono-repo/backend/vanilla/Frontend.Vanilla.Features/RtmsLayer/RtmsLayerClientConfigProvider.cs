using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal sealed class RtmsLayerClientConfigProvider(IRtmsLayerConfiguration rtmsConfiguration) : LambdaClientConfigProvider("vnRtmsLayer", () => new
{
    rtmsConfiguration.ToastShowInterval,
    rtmsConfiguration.ToastShowTime,
    rtmsConfiguration.CasinoGameLaunchUrl,
    rtmsConfiguration.CasinoUriScheme,
    rtmsConfiguration.ShowCloseButtonOnBonusTeaser,
    rtmsConfiguration.BonusTeaserRedirectUrl,
    rtmsConfiguration.EnableToastStacking,
    rtmsConfiguration.Version,
    rtmsConfiguration.IsCashierRedirectEnabled,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
