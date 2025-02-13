using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.ValueTicket;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ValueTicket;

public class ValueTicketClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;

    public ValueTicketClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IVanillaClientContentService>();

        Target = new ValueTicketClientConfigProvider(clientContentServiceMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldBeDisabled()
    {
        clientContentServiceMock.Setup(c =>
                c.GetChildrenAsync("App-v1.0/ValueTicket/Overlays", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(new List<ClientDocument>());

        var config = await Target_GetConfigAsync();

        Target.Name.Should().Be("vnValueTicket");
        config["isEnabled"].Should().Be(false);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnContentMessages_WhenEnabled()
    {
        var template = new List<ClientViewTemplate> { new () };
        clientContentServiceMock.Setup(c =>
                c.GetChildrenAsync("App-v1.0/ValueTicket/Overlays", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var config = await Target_GetConfigAsync();

        config["isEnabled"].Should().Be(true);
        config["overlays"].Should().Be(template);
    }
}
