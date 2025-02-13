using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.DataLayer;

public class DataLayerTrackingClientConfigProviderTests
{
    private IClientConfigProvider target;
    private Mock<ITagManager> renderer1;
    private Mock<ITagManager> renderer2;
    private Mock<ITagManager> renderer3;

    public DataLayerTrackingClientConfigProviderTests()
    {
        var config = new TrackingConfiguration();
        renderer1 = new Mock<ITagManager>();
        renderer2 = new Mock<ITagManager>();
        renderer3 = new Mock<ITagManager>();
        target = new DataLayerTrackingClientConfigProvider(config, new[] { renderer1.Object, renderer2.Object, renderer3.Object });

        config.DataLayerName = "dataLayerTest";
        config.NotTrackedQueryStrings = new[] { "foo", "bar" };
        config.EventCallbackTimeout = TimeSpan.FromMilliseconds(500);
        config.DataLayerUpdateTimeout = TimeSpan.FromMilliseconds(500);
        renderer1.SetupGet(r => r.Name).Returns("Facebook");
        renderer2.SetupGet(r => r.Name).Returns("GTM");
        renderer2.SetupGet(r => r.IsEnabled).Returns(true);
        renderer2.SetupGet(r => r.ClientInjectionEnabled).Returns(true);
        renderer2.Setup(r => r.GetClientScript()).Returns("script");
        renderer3.SetupGet(r => r.Name).Returns("Ensighten");
        renderer3.SetupGet(r => r.IsEnabled).Returns(true);
    }

    [Fact]
    public void Name_ShouldBeCorrect()
        => target.Name.Should().Be("vnTracking");

    [Fact]
    public async Task GetClientConfigurationAsync_ShouldCollectRendererInfo()
        => await RunAndExpect(new // Act
        {
            IsEnabled = true,
            DataLayerName = "dataLayerTest",
            NotTrackedQueryStrings = new[] { "foo", "bar" },
            TagManagerRenderers = new TrimmedRequiredString[] { "GTM", "Ensighten" },
            EventCallbackTimeoutInMilliseconds = 500,
            DataLayerUpdateTimeoutInMilliseconds = 500,
            ClientTagManagers = new[] { new { Name = new TrimmedRequiredString("GTM"), Script = "script" }, },
        });

    [Fact]
    public async Task GetClientConfigurationAsync_ShouldReturnEmpty_IfAllRenderersDisabled()
    {
        renderer2.SetupGet(r => r.IsEnabled).Returns(false);
        renderer3.SetupGet(r => r.IsEnabled).Returns(false);

        await RunAndExpect(new { IsEnabled = false }); // Act
    }

    private async Task RunAndExpect(object expected)
    {
        var result = await target.GetClientConfigAsync(default); // Act
        result.Should().BeEquivalentTo(expected);
    }
}
