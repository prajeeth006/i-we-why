using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ContentMessages;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ContentMessages;

public class ContentMessagesControllerTests
{
    private readonly ContentMessagesController controller;
    private readonly Mock<IContentMessagesService> contentMessagesServiceMock;
    private readonly TestLogger<ContentMessagesController> log;
    private readonly CancellationToken cancellationToken;

    private readonly IReadOnlyList<ClientDocument> messagesResult;
    private readonly IReadOnlyDictionary<string, IReadOnlyList<ClientDocument>> dictionaryMessagesResult;

    public ContentMessagesControllerTests()
    {
        contentMessagesServiceMock = new Mock<IContentMessagesService>();
        log = new TestLogger<ContentMessagesController>();
        cancellationToken = TestCancellationToken.Get();

        messagesResult = new List<ClientDocument> { new ClientDocument() };
        dictionaryMessagesResult = new Dictionary<string, IReadOnlyList<ClientDocument>>();

        contentMessagesServiceMock
            .Setup(x => x.GetMessagesAsync(It.IsAny<CancellationToken>(), It.IsAny<string>()))
            .ReturnsAsync(dictionaryMessagesResult);

        contentMessagesServiceMock
            .Setup(x => x.GetMessagesAsync(It.IsAny<CancellationToken>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()))
            .ReturnsAsync(messagesResult);

        controller = new ContentMessagesController(contentMessagesServiceMock.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnMessagesResult()
    {
        var result = (ObjectResult)await controller.Get(
            cancellationToken: cancellationToken,
            path: "messages",
            closedCookieKey: "m2",
            evaluateFullOnServer: true);

        contentMessagesServiceMock.Verify(s => s.GetMessagesAsync(
            It.Is<CancellationToken>(ct => ct == cancellationToken),
            It.Is<string>(p => p == "messages"),
            It.Is<string>(c => c == "m2"),
            It.Is<bool>(e => e)), Times.Once);

        result.Value.Should().BeEquivalentTo(new { messages = messagesResult });
    }

    [Fact]
    public async Task Get_ShouldReturnDictionaryMessagesResult()
    {
        var result = (ObjectResult)await controller.Get(
            "messages",
            cancellationToken,
            "");

        contentMessagesServiceMock.Verify(s => s.GetMessagesAsync(
            It.Is<CancellationToken>(ct => ct == cancellationToken),
            It.Is<string>(p => p == "messages")), Times.Once);

        result.Value.Should().BeEquivalentTo(new { messages = dictionaryMessagesResult });
    }

    [Fact]
    public async Task Get_ShouldReturnBadRequest_IfPathIsNotProvided()
    {
        var result = (BadRequestObjectResult)await controller.Get(
            path: string.Empty,
            cancellationToken: cancellationToken,
            "");

        result.Value.Should().BeEquivalentTo(new { message = "Path is required." });
    }

    [Fact]
    public async Task Get_ShouldReturnInternalServerErrorAndLogError_OnException()
    {
        var exception = new Exception("Error");
        contentMessagesServiceMock
            .Setup(x => x.GetMessagesAsync(It.IsAny<CancellationToken>(), It.IsAny<string>()))
            .ThrowsAsync(exception);

        var result = (ObjectResult)await controller.Get(
            path: "messages",
            cancellationToken: cancellationToken,
            "");

        log.Logged.Single().Verify(LogLevel.Error, exception, ("path", "messages"), ("filter", false));
        result.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }
}
