using System;
using System.Globalization;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetRequiredStringCommandTests
{
    private IGetRequiredStringCommand target;
    private Mock<IGetContentCommand> getItemCommand;

    private ExecutionMode mode;
    private Content<IFoo> contentToReturn;
    private const string ExpectedErrorPrefix = "Unable to get required string using expression f => f.Text from content /test - sw-KE because ";

    public GetRequiredStringCommandTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getItemCommand = new Mock<IGetContentCommand>();
        target = new GetRequiredStringCommand(getItemCommand.Object);

        mode = TestExecutionMode.Get();
        getItemCommand.SetupWithAnyArgs(s => s.GetAsync<IFoo>(default, null, default)).ReturnsAsync(() => contentToReturn);
    }

    public interface IFoo : IDocument
    {
        string Text { get; }
    }

    private Task<RequiredString> RunTest() => target.GetAsync<IFoo>(mode, "/requested-id", f => f.Text);

    [Fact]
    public async Task ShouldGetString()
    {
        contentToReturn = TestContent.Get(document: Mock.Of<IFoo>(f => f.Text == "hello"));

        var result = await RunTest(); // Act

        result.Should().Be("hello");
        getItemCommand.Verify(s => s.GetAsync<IFoo>(mode, "/requested-id", default));
    }

    [Theory]
    [InlineData(DocumentStatus.NotFound, "status of the content is NotFound. ")]
    [InlineData(DocumentStatus.Filtered, "status of the content is Filtered. ")]
    [InlineData(DocumentStatus.Invalid, "the content has errors: Test error. ")]
    public void ShouldThrow_IfContentNotSuccess(DocumentStatus status, string expectedErrorSuffix)
    {
        contentToReturn = TestContent.Get<IFoo>(status);
        RunThrowTest(expectedErrorSuffix);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void ShouldThrow_IfInvalidString(string value)
    {
        contentToReturn = TestContent.Get(document: Mock.Of<IFoo>(f => f.Text == value));
        RunThrowTest(expectedErrorSuffix: "the string is null or white-space. ");
    }

    private void RunThrowTest(string expectedErrorSuffix)
    {
        var result = new Func<Task>(async () => await RunTest())
            .Should().ThrowAsync<Exception>().Result;

        result.Which.Message.Should().ContainAll(
            ExpectedErrorPrefix + expectedErrorSuffix,
            ContentLoadOptions.Disclaimer,
            nameof(RunThrowTest),
            nameof(GetRequiredStringCommandTests));
    }
}
