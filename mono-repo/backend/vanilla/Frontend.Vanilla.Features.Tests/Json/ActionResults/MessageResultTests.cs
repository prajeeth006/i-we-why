using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json.ActionResults;

public class MessageResultTests
{
    private readonly Mock<IActionResult> originalResult;
    private readonly Mock<IJsonResponseBodyExtender> jsonResponseBodyExtender;
    private readonly ActionContext actionContext;
    private readonly Mock<HttpContext> httpContext;

    public MessageResultTests()
    {
        originalResult = new Mock<IActionResult>();
        jsonResponseBodyExtender = new Mock<IJsonResponseBodyExtender>();
        actionContext = new ActionContext();
        httpContext = new Mock<HttpContext>();
        httpContext.Setup(c => c.RequestServices.GetService(typeof(IJsonResponseBodyExtender))).Returns(jsonResponseBodyExtender.Object);
        actionContext.HttpContext = httpContext.Object;
    }

    private MessagesResponseBodyExtensionWriter GetWriter()
    {
        jsonResponseBodyExtender.Verify(e => e.AddForThisRequest(It.IsAny<MessagesResponseBodyExtensionWriter>()));

        return (MessagesResponseBodyExtensionWriter)jsonResponseBodyExtender.Invocations.First(i => i.Method.Name == nameof(IJsonResponseBodyExtender.AddForThisRequest))
            .Arguments[0];
    }

    [Fact]
    public async Task ShouldAddMultipleMessages()
    {
        var messages = new List<ApiMessage> { new ApiMessage(MessageType.Error, "me"), new ApiMessage(MessageType.Information, "mi") };
        var result = new MessageResult(originalResult.Object, messages);

        await result.ExecuteResultAsync(actionContext);

        var writer = GetWriter();

        writer.Messages.Should().BeSameAs(messages);
    }

    [Fact]
    public async Task ShouldAddMultipleMessages_Later()
    {
        var messages = new List<ApiMessage> { new ApiMessage(MessageType.Error, "me"), new ApiMessage(MessageType.Information, "mi") };
        var result = new MessageResult(originalResult.Object, messages);

        result.Messages.Add(new ApiMessage(MessageType.Success, "ms"));

        await result.ExecuteResultAsync(actionContext);

        var writer = GetWriter();

        writer.Messages.Should().BeSameAs(messages);
        writer.Messages.Should().HaveCount(3);
        writer.Messages[2].Content.Should().Be("ms");
    }

    [Fact]
    public void ShouldAllowToGetAllMessagesFromAllResults()
    {
        var result = new MessageResult(originalResult.Object, new List<ApiMessage> { new ApiMessage(MessageType.Success, "s") });
        var result2 = new MessageResult(result, new List<ApiMessage> { new ApiMessage(MessageType.Error, "e") });

        var messages = result2.GetMessages();

        messages.Should().HaveCount(2);
        messages.Should().Contain(m => m.Type == MessageType.Error && m.Content == "e");
        messages.Should().Contain(m => m.Type == MessageType.Success && m.Content == "s");
    }
}
