using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class BettingStatusDslProviderSyntaxTests : SyntaxTestBase<IBettingStatusDslProvider>
{
    [Fact]
    public void UserHasBets_Test()
    {
        Provider.Setup(p => p.UserHasBets(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("BettingStatus.UserHasBets", true);
    }
}
