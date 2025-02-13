using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCImageTextMapperTests : ClientContentMapperTestsBase<IPCImageText, ClientPCImageText>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Image).Returns(TestContentImage.Get());
        SourceDoc.SetupGet(s => s.ImageLink).Returns(TestContentLink.Get());
        SourceDoc.SetupGet(s => s.Text).Returns("<text />");

        await RunTest(new ClientPcImageTextMapper());

        TargetDoc.Image.Should().BeSameAs(SourceDoc.Object.Image);
        TargetDoc.ImageLink.Should().BeSameAs(SourceDoc.Object.ImageLink);
        TargetDoc.Text.Should().Be("client: <text />");
    }
}
