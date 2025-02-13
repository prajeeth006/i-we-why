using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.CookieConsent;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.CookieConsent;

public class CookieConsentClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<ICookieConsentConfiguration> cookieConsentConfiguration;

    public CookieConsentClientConfigProviderTests()
    {
        clientContentService = new Mock<IVanillaClientContentService>();
        cookieConsentConfiguration = new Mock<ICookieConsentConfiguration>();

        Target = new CookieConsentClientConfigProvider(
            clientContentService.Object,
            cookieConsentConfiguration.Object,
            new TestLogger<CookieConsentClientConfigProvider>());
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnCookieConsentConfig()
    {
        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        cookieConsentConfiguration.Setup(c => c.Condition.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);

        var message = new ClientViewTemplate();
        clientContentService.Setup(c => c.GetAsync("App-v1.0/CookieConsent/Message", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(message);

        var config = await Target_GetConfigAsync(); // Act

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "content", message },
            { "condition", clientEvaluationResult },
        });
    }
}
