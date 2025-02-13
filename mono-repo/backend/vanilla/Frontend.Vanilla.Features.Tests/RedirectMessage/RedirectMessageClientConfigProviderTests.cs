using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.RedirectMessage;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RedirectMessage;

public class RedirectMessageClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IRedirectMessageConfiguration> redirectMessageConfiguration;
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<IEnvironmentProvider> envProvider;

    public RedirectMessageClientConfigProviderTests()
    {
        redirectMessageConfiguration = new Mock<IRedirectMessageConfiguration>();
        clientContentService = new Mock<IVanillaClientContentService>();
        envProvider = new Mock<IEnvironmentProvider>();

        Target = new RedirectMessageClientConfigProvider(
            clientContentService.Object,
            redirectMessageConfiguration.Object,
            envProvider.Object,
            new TestLogger<RedirectMessageClientConfigProvider>());
    }

    [Fact]
    public async Task ShouldReturnRedirectMessageClientConfig()
    {
        envProvider.SetupGet(x => x.CurrentLabel).Returns("bwin.es");

        var message = new ClientViewTemplate();

        clientContentService.Setup(c => c.GetAsync("App-v1.0/RedirectMessage/MessageWithCountryName", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(message);

        var expression1 = new Mock<IDslExpression<bool>>();

        var redirectRules = new[] { new RedirectRules() { Condition = expression1.Object, Redirect = new Redirect() { Label = "bwin.com", Url = "www.bwin.com" } } };
        redirectMessageConfiguration.SetupGet(c => c.IsEnabled).Returns(true);
        redirectMessageConfiguration.SetupGet(c => c.Rules).Returns(redirectRules);

        expression1.Setup(c => c.EvaluateAsync(Ct)).ReturnsAsync(true);

        var config = await Target_GetConfigAsync();

        config["currentLabel"].Should().Be("bwin.es");
        config["redirectLabel"].Should().Be("bwin.com");
        config["url"].Should().Be("www.bwin.com");
        config["content"].Should().Be(message);
    }
}
