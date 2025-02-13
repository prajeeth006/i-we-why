using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json.ActionResults;

public class TechnicalErrorMessageResultTests
{
    private readonly Mock<IActionResult> originalResult;
    private readonly Mock<IJsonResponseBodyExtender> jsonResponseBodyExtender;
    private readonly Mock<IContentService> contentService;
    private readonly ActionContext actionContext;
    private readonly Mock<HttpContext> httpContext;

    public TechnicalErrorMessageResultTests()
    {
        originalResult = new Mock<IActionResult>();
        jsonResponseBodyExtender = new Mock<IJsonResponseBodyExtender>();
        contentService = new Mock<IContentService>();
        actionContext = new ActionContext();
        httpContext = new Mock<HttpContext>();
        httpContext.Setup(c => c.RequestServices.GetService(typeof(IJsonResponseBodyExtender))).Returns(jsonResponseBodyExtender.Object);
        httpContext.Setup(c => c.RequestServices.GetService(typeof(IContentService))).Returns(contentService.Object);
        actionContext.HttpContext = httpContext.Object;

        contentService.Setup(c => c.GetRequiredString<IGenericListItem>("App-v1.0/Resources/Messages", i => i.VersionedList["TechnicalError"])).Returns("tech err");
    }

    private MessagesResponseBodyExtensionWriter GetWriter()
    {
        jsonResponseBodyExtender.Verify(e => e.AddForThisRequest(It.IsAny<MessagesResponseBodyExtensionWriter>()));

        return (MessagesResponseBodyExtensionWriter)jsonResponseBodyExtender.Invocations.First(i => i.Method.Name == nameof(IJsonResponseBodyExtender.AddForThisRequest))
            .Arguments[0];
    }

    [Fact]
    public async Task ShouldAddTechnicalErrorMessage()
    {
        var result = new TechnicalErrorMessageResult(originalResult.Object, "scope");

        await result.ExecuteResultAsync(actionContext);

        var writer = GetWriter();

        writer.Messages.Should().HaveCount(1);
        writer.Messages[0].Type.Should().Be(MessageType.Error);
        writer.Messages[0].Scope.Should().Be("scope");
        writer.Messages[0].Content.Should().Be("tech err");
    }
}
