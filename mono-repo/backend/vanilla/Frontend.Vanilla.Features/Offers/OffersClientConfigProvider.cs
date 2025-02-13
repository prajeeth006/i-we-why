using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Offers;

internal sealed class OffersClientConfigProvider(IOffersConfiguration config) : LambdaClientConfigProvider("vnOffers",
    () => new
    {
        config.UpdateInterval,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
