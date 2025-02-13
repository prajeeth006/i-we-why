using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Offer;
using Frontend.Vanilla.Features.Offers;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Offer;

public class OfferButtonClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IContentService> clientContentServiceMock;
    private readonly Mock<IOffersConfiguration> offersConfigurationMock;
    private readonly IViewTemplate content = Mock.Of<IViewTemplate>(t => t.Title == "message");
    private readonly IViewTemplate buttonClass = Mock.Of<IViewTemplate>(t => t.Title == "buttonClass");
    private readonly IViewTemplate iconClass = Mock.Of<IViewTemplate>(t => t.Title == "iconClass");

    public OfferButtonClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IContentService>();
        offersConfigurationMock = new Mock<IOffersConfiguration>();

        clientContentServiceMock.Setup(c => c.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/Messages", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(content);
        clientContentServiceMock.Setup(c => c.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/ButtonClass", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(buttonClass);
        clientContentServiceMock.Setup(c => c.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/IconClass", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(iconClass);

        Target = new OfferButtonClientConfigProvider(clientContentServiceMock.Object, offersConfigurationMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ReturnsConfig()
    {
        var config = await Target_GetConfigAsync(); // Act

        Target.Name.Should().Be("vnOfferButton");
        config["v2"].Should().Be(false);
        config["content"].Should().BeEquivalentTo(content);
        config["buttonClass"].Should().BeEquivalentTo(buttonClass);
        config["iconClass"].Should().BeNull();
    }

    [Fact]
    public async Task GetClientConfiguration_ReturnsConfigV2()
    {
        var buttonClassV2 = Mock.Of<IViewTemplate>(t => t.Title == "buttonClass");
        offersConfigurationMock.SetupGet(c => c.OfferButtonV2).Returns(true);
        clientContentServiceMock.Setup(c => c.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Offer/ButtonClassV2", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(buttonClassV2);
        var config = await Target_GetConfigAsync(); // Act

        Target.Name.Should().Be("vnOfferButton");
        config["v2"].Should().Be(true);
        config["content"].Should().BeEquivalentTo(content);
        config["buttonClass"].Should().BeEquivalentTo(buttonClass);
        config["iconClass"].Should().BeEquivalentTo(iconClass);
    }
}
