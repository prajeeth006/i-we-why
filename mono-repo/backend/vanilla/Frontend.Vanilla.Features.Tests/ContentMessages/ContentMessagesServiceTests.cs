using System.Threading;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentMessages;

public class ContentMessagesServiceTests
{
    private readonly IContentMessagesService target;
    private readonly Mock<IContentMessagesLoader> contentMessagesLoaderMock;
    private readonly CancellationToken cancellationToken;

    public ContentMessagesServiceTests()
    {
        contentMessagesLoaderMock = new Mock<IContentMessagesLoader>();
        cancellationToken = TestCancellationToken.Get();

        target = new ContentMessagesService(contentMessagesLoaderMock.Object);
    }

    [Fact]
    public void GetMessagesAsync_ShouldInvokeMessagesLoader_WithCorrectParameters()
    {
        target.GetMessagesAsync(
            cancellationToken: cancellationToken,
            path: "messages",
            closedCookieKey: "m2",
            evaluateFullOnServer: true);

        contentMessagesLoaderMock.Verify(l => l.LoadAsync(
            It.Is<DocumentId>(d => d.Path.Contains("messages")),
            It.Is<TrimmedRequiredString>(c => c.Value == "m2"),
            It.Is<DslEvaluation>(e => e == DslEvaluation.FullOnServer),
            It.Is<CancellationToken>(t => t == cancellationToken)), Times.Once());
    }

    [Fact]
    public void GetMessagesAsync_ShouldInvokeLoadDictionaryAsync_WithCorrectParameters()
    {
        target.GetMessagesAsync(cancellationToken: cancellationToken, path: "messages");

        contentMessagesLoaderMock.Verify(l => l.LoadDictionaryAsync(
            It.Is<DocumentId>(d => d.Path.Contains("messages")),
            It.Is<CancellationToken>(t => t == cancellationToken)), Times.Once());
    }
}
