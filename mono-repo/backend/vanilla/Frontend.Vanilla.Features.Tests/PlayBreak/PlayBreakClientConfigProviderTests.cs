using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.PlayBreak;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.PlayBreak;

public class PlayBreakClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;

    public PlayBreakClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IVanillaClientContentService>();

        clientContentServiceMock.Setup(c => c.GetChildrenAsync($"{AppPlugin.ContentRoot}/PlayBreak", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(new List<ClientDocument> { new ClientDocument { InternalId = "play-break" } });

        Target = new PlayBreakClientConfigProvider(clientContentServiceMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ReturnsConfig()
    {
        var config = await Target_GetConfigAsync(); // Act

        Target.Name.Should().Be("vnPlayBreak");
        config["templates"].Should()
            .BeEquivalentTo(new Dictionary<string, ClientDocument> { { "play-break", new ClientDocument { InternalId = "play-break" } } });
    }
}
