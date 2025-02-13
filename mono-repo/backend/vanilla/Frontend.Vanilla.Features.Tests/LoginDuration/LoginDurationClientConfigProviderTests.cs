using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LoginDuration;

public class LoginDurationClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<ILoginDurationProvider> loginDurationProvider;

    public LoginDurationClientConfigProviderTests()
    {
        loginDurationProvider = new Mock<ILoginDurationProvider>();
        Target = new LoginDurationClientConfigProvider(loginDurationProvider.Object, new TestLogger<LoginDurationClientConfigProvider>());
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnLoginDuration");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnNLoginDurationConfigConfig()
    {
        loginDurationProvider.Setup(n => n.GetTextAsync(Ct)).ReturnsAsync("text");
        loginDurationProvider.SetupGet(n => n.SlotName).Returns("header_slot");

        var config = await Target_GetConfigAsync();

        config["text"].Should().Be("text");
        config["slotName"].Should().Be("header_slot");
    }
}
