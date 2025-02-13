using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SelfExclusion;

internal sealed class SelfExclusionClientConfigProvider(ISelfExclusionConfiguration configuration) : LambdaClientConfigProvider("vnSelfExclusion", () => new
{
    updateInterval = configuration.UpdateInterval.TotalMilliseconds,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
