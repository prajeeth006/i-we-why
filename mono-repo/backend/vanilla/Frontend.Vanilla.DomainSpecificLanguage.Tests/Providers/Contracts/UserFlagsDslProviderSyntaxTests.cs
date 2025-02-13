using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class UserFlagsDslProviderSyntaxTests : SyntaxTestBase<IUserFlagsDslProvider>
{
    [Fact]
    public void Get_Test()
    {
        Provider.Setup(p => p.GetAsync(Mode, "Offer")).ReturnsAsync("Enabled");
        EvaluateAndExpect("UserFlags.Get('Offer')", "Enabled");
    }
}
