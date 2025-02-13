using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json.ActionResults;

public class HttpActionResultExtensionsTests
{
    private Mock<IActionResult> originalResult;

    public HttpActionResultExtensionsTests()
    {
        originalResult = new Mock<IActionResult>();

        originalResult.Setup(r => r.ExecuteResultAsync(It.IsAny<ActionContext>())).Returns(Task.CompletedTask);
    }

    private void VerifyMessage(IActionResult result, MessageType type, string msg, int index = 0, string scope = "")
    {
        var messages = ((MessageResult)result).Messages;

        messages[index].Type.Should().Be(type);
        messages[index].Content.Should().Be(msg);
        messages[index].Scope.Should().Be(scope);
    }

    [Fact]
    public void Messages_ShouldAddMultipleMessage()
    {
        var result = (MessageResult)originalResult.Object.WithMessages(new[] { new ApiMessage(MessageType.Error, "me"), new ApiMessage(MessageType.Information, "mi") });

        VerifyMessage(result, MessageType.Error, "me");
        VerifyMessage(result, MessageType.Information, "mi", 1);
    }

    [Fact]
    public void ErrorMessage_ShouldAddErrorMessage()
    {
        var result = originalResult.Object.WithErrorMessage("err", scope: "scope");

        VerifyMessage(result, MessageType.Error, "err", scope: "scope");
    }

    [Fact]
    public void WarningMessage_ShouldAddWarningMessage()
    {
        var result = originalResult.Object.WithWarningMessage("wrn", scope: "scope");

        VerifyMessage(result, MessageType.Warning, "wrn", scope: "scope");
    }

    [Fact]
    public void InfoMessage_ShouldAddInfoMessage()
    {
        var result = originalResult.Object.WithInfoMessage("i", scope: "scope");

        VerifyMessage(result, MessageType.Information, "i", scope: "scope");
    }

    [Fact]
    public void SuccessMessage_ShouldAddSuccessMessage()
    {
        var result = originalResult.Object.WithSuccessMessage("s", scope: "scope");

        VerifyMessage(result, MessageType.Success, "s", scope: "scope");
    }

    [Fact]
    public void Messages_ShouldAddMessagesToTheSameInstance()
    {
        var result = originalResult.Object.WithMessages(new[] { new ApiMessage(MessageType.Error, "me"), new ApiMessage(MessageType.Information, "mi") });
        var result2 = (MessageResult)result.WithErrorMessage("me2");

        result2.Should().BeSameAs(result);
        VerifyMessage(result2, MessageType.Error, "me");
        VerifyMessage(result2, MessageType.Information, "mi", 1);
        VerifyMessage(result2, MessageType.Error, "me2", 2);
    }
}
