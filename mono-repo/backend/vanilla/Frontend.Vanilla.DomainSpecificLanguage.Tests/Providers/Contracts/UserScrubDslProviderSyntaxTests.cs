using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class UserScrubDslProviderSyntaxTests : SyntaxTestBase<IUserScrubDslProvider>
{
    [Theory, BooleanData]
    public void IsScrubbedForTest(bool value)
    {
        Provider.Setup(p => p.IsScrubbedForAsync(Mode, "casino")).ReturnsAsync(value);
        EvaluateAndExpect("UserScrub.IsScrubbedFor('casino')", value);
    }
}
