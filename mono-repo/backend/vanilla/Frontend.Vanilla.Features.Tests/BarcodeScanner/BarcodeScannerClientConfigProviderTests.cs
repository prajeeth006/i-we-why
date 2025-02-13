using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Features.BarcodeScanner;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.BarcodeScanner;

public class BarcodeScannerClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IBarcodeScannerIntegrationConfiguration> barcodeScannerIntegrationConfiguration;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;

    public BarcodeScannerClientConfigProviderTests()
    {
        barcodeScannerIntegrationConfiguration = new Mock<IBarcodeScannerIntegrationConfiguration>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();

        Target = new BarcodeScannerClientConfigProvider(
            barcodeScannerIntegrationConfiguration.Object,
            clientContentServiceMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnBarcodeScanner()
    {
        var template = new List<ClientViewTemplate> { new () };
        barcodeScannerIntegrationConfiguration.SetupGet(c => c.ConditionalEvents).Returns(
            new Dictionary<string, string>()
            {
                { "Betslip", "." },
                { "Event", "^[avc]" },
            });

        clientContentServiceMock.Setup(c =>
                c.GetChildrenAsync(
                    $"{AppPlugin.ContentRoot}/BarcodeScanner/Overlays",
                    Ct,
                    It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var config = await Target_GetConfigAsync();

        config["conditionalEvents"].Should().BeEquivalentTo(new List<KeyValuePair<string, string>>()
        {
            new ("Betslip", "."),
            new ("Event", "^[avc]"),
        });
        config["overlays"].Should().Be(template);
    }
}
