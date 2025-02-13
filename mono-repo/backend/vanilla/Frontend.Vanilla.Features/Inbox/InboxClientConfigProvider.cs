using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Inbox;

internal sealed class InboxClientConfigProvider(IInboxConfiguration config) : LambdaClientConfigProvider("vnInbox", () => new
{
    config.CounterPullInterval,
    config.Enabled,
    config.JumioKycUrl,
    config.LazyLoading,
    config.ReadTime,
    config.ShowOfferMessage,
    config.TriggerJumioFromPlayerInbox,
    config.UseRtms,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
