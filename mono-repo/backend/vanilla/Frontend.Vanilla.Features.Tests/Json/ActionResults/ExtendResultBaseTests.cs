#nullable enable
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json.ActionResults;

public class TestExtendResult : ExtendResultBase
{
    public IJsonResponseBodyExtensionWriter? Writer { get; set; }

    public TestExtendResult(IActionResult innerResult)
        : base(innerResult) { }

    protected override Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext)
    {
        return Task.FromResult(Writer);
    }
}

public sealed class ExtendResultBaseTests
{
    private readonly TestExtendResult extendResult;
    private readonly Mock<IActionResult> originalResult;
    private readonly Mock<IJsonResponseBodyExtender> jsonResponseBodyExtender;
    private readonly ActionContext actionContext;
    private readonly Mock<HttpContext> httpContext;

    public ExtendResultBaseTests()
    {
        originalResult = new Mock<IActionResult>();
        jsonResponseBodyExtender = new Mock<IJsonResponseBodyExtender>();
        actionContext = new ActionContext();
        httpContext = new Mock<HttpContext>();
        httpContext.Setup(c => c.RequestServices.GetService(typeof(IJsonResponseBodyExtender))).Returns(jsonResponseBodyExtender.Object);
        actionContext.HttpContext = httpContext.Object;

        extendResult = new TestExtendResult(originalResult.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldCallExtendResponse()
    {
        var writer = Mock.Of<IJsonResponseBodyExtensionWriter>();

        extendResult.Writer = writer;

        await extendResult.ExecuteResultAsync(actionContext);

        jsonResponseBodyExtender.Verify(e => e.AddForThisRequest(writer));
    }

    [Fact]
    public void BwinVanillaTesting_ShouldExposeTheOriginalResult()
    {
        var wrapResult = new TestExtendResult(extendResult);

        wrapResult.GetOriginalResult<IActionResult>().Should().BeSameAs(originalResult.Object);
        extendResult.GetOriginalResult<IActionResult>().Should().BeSameAs(originalResult.Object);
    }

    [Fact]
    public void BwinVanillaTesting_ShouldExposeTheOriginalResultAsDynamic()
    {
        var wrapResult = new TestExtendResult(extendResult);

        ((object)wrapResult.GetOriginalResult()).Should().BeSameAs(originalResult.Object);
        ((object)extendResult.GetOriginalResult()).Should().BeSameAs(originalResult.Object);
    }

    [Fact]
    public void BwinVanillaTesting_ShouldExposeResultsOfSpecificType()
    {
        var wrapResult = new TestExtendResult(extendResult);

        var testResults = wrapResult.GetResultsOfType<TestExtendResult>();

        testResults.Should().HaveCount(2);
        testResults[0].Should().BeSameAs(extendResult);
        testResults[1].Should().BeSameAs(wrapResult);
    }

    [Fact]
    public void BwinVanillaTesting_ShouldExposeAllResults()
    {
        var wrapResult = new TestExtendResult(extendResult);

        var testResults = wrapResult.GetResults();

        testResults.Should().HaveCount(3);
        ((object)testResults[0]).Should().BeSameAs(originalResult.Object);
        ((object)testResults[1]).Should().BeSameAs(extendResult);
        ((object)testResults[2]).Should().BeSameAs(wrapResult);
    }

    [Fact]
    public void ShouldExposeTheInnerResult()
    {
        var wrapResult = new TestExtendResult(extendResult);

        wrapResult.InnerResult.Should().BeSameAs(extendResult);
        extendResult.InnerResult.Should().BeSameAs(originalResult.Object);
    }
}
