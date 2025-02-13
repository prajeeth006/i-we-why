using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class LoyalityProfileDslProviderTests : SyntaxTestBase<ILoyalityProfileDslProvider>
{
    [Fact]
    public void MlifeNo_Test()
    {
        Provider.Setup(p => p.GetMlifeNoAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("LoyalityProfile.MlifeNo", 1m);
    }

    [Fact]
    public void MlifeTier_Test()
    {
        Provider.Setup(p => p.GetMlifeTierAsync(Mode)).ReturnsAsync("sss");
        EvaluateAndExpect("LoyalityProfile.MlifeTier", "sss");
    }

    [Fact]
    public void GetMlifeTierDescAsync()
    {
        Provider.Setup(p => p.GetMlifeTierDescAsync(Mode)).ReturnsAsync("sss");
        EvaluateAndExpect("LoyalityProfile.MlifeTierDesc", "sss");
    }

    [Fact]
    public void GetMlifetierCreditsAsync()
    {
        Provider.Setup(p => p.GetMlifetierCreditsAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("LoyalityProfile.MlifetierCredits", 1m);
    }
}
