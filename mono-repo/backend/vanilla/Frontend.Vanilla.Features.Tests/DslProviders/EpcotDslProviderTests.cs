using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.Header;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class EpcotDslProviderTests
{
    private IEpcotDslProvider target;
    private Mock<IHeaderConfiguration> headerConfiguration;
    private Mock<IAccountMenuConfiguration> accountMenuConfiguration;

    public EpcotDslProviderTests()
    {
        headerConfiguration = new Mock<IHeaderConfiguration>();
        accountMenuConfiguration = new Mock<IAccountMenuConfiguration>();

        target = new EpcotDslProvider(headerConfiguration.Object, accountMenuConfiguration.Object);
    }

    [Theory]
    [InlineData("header", 2, true)]
    [InlineData("HeadEr", 2, true)]
    [InlineData("header", 1, false)]
    [InlineData("Heder", 2, false)]
    [InlineData("Heder", 3, false)]
    public void IsEpcotHeaderEnabled(string featureName, int version, bool result)
    {
        headerConfiguration.SetupGet(l => l.Version).Returns(version);
        target.IsEnabled(featureName).Should().Be(result);
    }

    [Theory]
    [InlineData("accountmenu", 4, true)]
    [InlineData("AccountMenu", 4, true)]
    [InlineData("accountmenu", 1, false)]
    [InlineData("taccountmen", 4, false)]
    [InlineData("taccountmen", 3, false)]
    [InlineData(null, 4, false)]
    public void IsEpcotAccountMenuEnabled(string featureName, int version, bool result)
    {
        accountMenuConfiguration.SetupGet(l => l.Version).Returns(version);
        target.IsEnabled(featureName).Should().Be(result);
    }
}
