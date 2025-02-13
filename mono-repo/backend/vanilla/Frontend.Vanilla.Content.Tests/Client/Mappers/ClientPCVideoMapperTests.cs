using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCVideoMapperTests : ClientContentMapperTestsBase<IPCVideo, ClientPCVideo>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        // Setup
        var contentVideo = new ContentVideo(
            id: "f5fbfae1e78242a5aba5444498ed3379",
            src: "https://iframe.videodelivery.net/c6ee00c214c84fdd9f78bbf2eb14373f",
            width: 350,
            height: null);

        SourceDoc.SetupGet(v => v.Video).Returns(contentVideo);

        // Act
        await RunTest(new ClientPcVideoMapper());

        // Assert
        TargetDoc.Video?.Should().BeEquivalentTo(contentVideo);
        TargetDoc.Controls.Should().BeFalse();
    }
}
