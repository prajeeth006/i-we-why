using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Features.DepositLimits;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DepositLimits;

public class DepositLimitExceededClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;

    public DepositLimitExceededClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IVanillaClientContentService>();

        Target = new DepositLimitExceededClientConfigProvider(clientContentServiceMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnContentMessages()
    {
        var template = new ClientViewTemplate();
        clientContentServiceMock.Setup(c =>
                c.GetAsync("App-v1.0/DepositLimits/BetstationDepositLimit", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var config = await Target_GetConfigAsync();

        config["template"].Should().Be(template);
    }
}
