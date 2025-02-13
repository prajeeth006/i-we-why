using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCTeaserMapperTests : ClientContentMapperTestsBase<IPCTeaser, ClientPCTeaser>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Image).Returns(TestContentImage.Get());
        SourceDoc.SetupGet(s => s.ImageLink).Returns(TestContentLink.Get());
        SourceDoc.SetupGet(s => s.ImageOverlay).Returns(TestContentImage.Get());

        SourceDoc.SetupGet(s => s.ImageOverlayClass).Returns("ui-image-overlay");
        SourceDoc.SetupGet(s => s.Text).Returns("<text />");
        SourceDoc.SetupGet(s => s.Subtitle).Returns("Football");
        SourceDoc.SetupGet(s => s.Summary).Returns("Football is the best sport.");
        SourceDoc.SetupGet(s => s.OptionalText).Returns("<optional />");

        await RunTest(new ClientPcTeaserMapper());

        TargetDoc.Image.Should().BeSameAs(SourceDoc.Object.Image);
        TargetDoc.ImageLink.Should().BeSameAs(SourceDoc.Object.ImageLink);
        TargetDoc.ImageOverlay.Should().BeSameAs(SourceDoc.Object.ImageOverlay);
        TargetDoc.ImageOverlayClass.Should().Be("client: ui-image-overlay");
        TargetDoc.Text.Should().Be("client: <text />");
        TargetDoc.Subtitle.Should().Be("client: Football");
        TargetDoc.Summary.Should().Be("client: Football is the best sport.");
        TargetDoc.OptionalText.Should().Be("client: <optional />");
    }
}
