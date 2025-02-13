using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.DynamicLayout;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynamicLayout;

public class DynamicLayoutClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IDynamicLayoutConfiguration> dynamicLayoutConfigurationMock;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly TestLogger<DynamicLayoutClientConfigProvider> log;

    public DynamicLayoutClientConfigProviderTests()
    {
        dynamicLayoutConfigurationMock = new Mock<IDynamicLayoutConfiguration>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        log = new TestLogger<DynamicLayoutClientConfigProvider>();

        Target = new DynamicLayoutClientConfigProvider(dynamicLayoutConfigurationMock.Object, clientContentServiceMock.Object, log);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnDynamicLayout");
    }

    [Fact]
    public async Task ShouldReturnEmptyCollection_IfNoSlotsConfigured()
    {
        var slots = new Dictionary<string, SlotConfiguration>();
        dynamicLayoutConfigurationMock.SetupGet(c => c.Slots).Returns(slots);

        var config = await Target_GetConfigAsync(); // Act

        config["slots"].Should().BeEquivalentTo(slots);
    }

    [Fact]
    public async Task ShouldReturnSlotsConfig_WithContent()
    {
        var slots = new Dictionary<string, SlotConfiguration>()
        {
            { "slot", new SlotConfiguration("single", null, new[] { "Path " }) },
        };

        dynamicLayoutConfigurationMock.SetupGet(c => c.Slots).Returns(slots);

        var template = new ClientDocument();
        clientContentServiceMock.Setup(s => s.GetAsync(It.IsAny<DocumentId>(), Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var config = await Target_GetConfigAsync(); // Act

        config["slots"].Should().BeEquivalentTo(new Dictionary<string, object>()
        {
            {
                "slot", new
                {
                    Type = "single",
                    content = new List<ClientDocument> { template },
                }
            },
        });
    }

    [Fact]
    public async Task ShouldReturnSlotsConfig_WithoutContent()
    {
        var slots = new Dictionary<string, SlotConfiguration>()
        {
            { "single_slot", new SlotConfiguration("single", null, null) },
            { "multi_slot", new SlotConfiguration("multi", null, null) },
        };

        dynamicLayoutConfigurationMock.SetupGet(c => c.Slots).Returns(slots);

        var config = await Target_GetConfigAsync(); // Act

        config["slots"].Should().BeEquivalentTo(new Dictionary<string, object>()
        {
            {
                "single_slot", new
                {
                    Type = "single",
                }
            },
            {
                "multi_slot", new
                {
                    Type = "multi",
                }
            },
        });
    }
}
