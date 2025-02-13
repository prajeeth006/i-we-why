using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.HomePage;

internal sealed class HomePageClientConfigProvider(IHomePageConfiguration config) : LambdaClientConfigProvider("vnHomePage", async ct => new
{
    isEnabledCondition = await config.IsEnabledCondition.EvaluateForClientAsync(ct),
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
