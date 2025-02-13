using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.DepositLimits;

internal sealed class DepositLimitExceededClientConfigProvider(IVanillaClientContentService clientContentService) : LambdaClientConfigProvider("vnDepositLimitExceeded",
    async cancellationToken =>
    {
        var template =
            await clientContentService.GetAsync($"{AppPlugin.ContentRoot}/DepositLimits/BetstationDepositLimit",
                cancellationToken);

        return new
        {
            template,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
