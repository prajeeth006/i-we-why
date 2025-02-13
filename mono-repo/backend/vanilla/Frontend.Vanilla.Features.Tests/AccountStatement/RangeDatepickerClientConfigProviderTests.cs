using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.RangeDatepicker;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RangeDatepicker;

public class RangeDatepickerClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> vanillaClientContentServiceMock;
    private readonly Mock<IRangeDatepickerConfiguration> rangeDatepickerConfigurationMock;

    public RangeDatepickerClientConfigProviderTests()
    {
        vanillaClientContentServiceMock = new Mock<IVanillaClientContentService>();
        rangeDatepickerConfigurationMock = new Mock<IRangeDatepickerConfiguration>();

        Target = new RangeDatepickerClientConfigProvider(vanillaClientContentServiceMock.Object, rangeDatepickerConfigurationMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnRangeDatepickerContent()
    {
        var content = new List<ClientDocument> { new () };

        vanillaClientContentServiceMock.Setup(c => c.GetChildrenAsync($"{AppPlugin.ContentRoot}/RangeDatepicker", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(content);

        var config = await Target_GetConfigAsync();

        config["templates"].Should().BeEquivalentTo(content.ToDictionary(item => item.InternalId?.ItemName ?? string.Empty));
    }
}
