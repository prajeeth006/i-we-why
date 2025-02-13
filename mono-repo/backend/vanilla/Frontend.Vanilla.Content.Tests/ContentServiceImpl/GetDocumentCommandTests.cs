using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetDocumentCommandTests
{
    private IGetDocumentCommand target;
    private Mock<IGetContentCommand> getItemCommand;
    private TestLogger<GetDocumentCommand> log;

    private ExecutionMode mode;
    private ContentLoadOptions options;
    private Content<IPCText> contentToReturn;

    public GetDocumentCommandTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getItemCommand = new Mock<IGetContentCommand>();
        log = new TestLogger<GetDocumentCommand>();
        target = new GetDocumentCommand(getItemCommand.Object, log);

        mode = TestExecutionMode.Get();
        options = TestContentLoadOptions.Get();
        contentToReturn = TestContent.Get<IPCText>();
        getItemCommand.SetupWithAnyArgs(s => s.GetAsync<IPCText>(default, null, default)).ReturnsAsync(() => contentToReturn);
    }

    private static readonly IEnumerable<(DocumentStatus Status, string ExpectedError)> Errors = new[]
    {
        (DocumentStatus.Invalid, "Failed to load content /test - sw-KE because it has errors: Test error."),
        (DocumentStatus.Filtered, "Failed to load content /test - sw-KE because it's required (must exist)"
                                  + $" but it's {nameof(DocumentStatus.Filtered)}. {ContentLoadOptions.Disclaimer}"),
        (DocumentStatus.NotFound, "Failed to load content /test - sw-KE because it's required (must exist)"
                                  + $" but it's {nameof(DocumentStatus.NotFound)}. {ContentLoadOptions.Disclaimer}"),
    };

    [Theory]
    [InlineData(DocumentStatus.Success)]
    [InlineData(DocumentStatus.Filtered)]
    [InlineData(DocumentStatus.NotFound)]
    public async Task GetAsync_ShouldGetDocument_IfSuccess(DocumentStatus status)
    {
        contentToReturn = TestContent.Get<IPCText>(status);

        var result = await target.GetAsync<IPCText>(mode, "/requested-id", options); // Act

        result.Should().Be((contentToReturn as SuccessContent<IPCText>)?.Document);
        getItemCommand.Verify(s => s.GetAsync<IPCText>(mode, "/requested-id", options));
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task GetAsync_ShouldLog_IfError()
    {
        contentToReturn = TestContent.Get<IPCText>(DocumentStatus.Invalid);

        var result = await target.GetAsync<IPCText>(mode, "/requested-id", options);

        result.Should().BeNull();
        log.Logged.Single().Verify(
            LogLevel.Error,
            ("id", contentToReturn.Id),
            ("errors", ((InvalidContent<IPCText>)contentToReturn).Errors.ToDebugString()));
    }

    [Fact]
    public async Task GetRequiredAsync_ShouldGetDocument_IfSuccess()
    {
        var result = await target.GetRequiredAsync<IPCText>(mode, "/requested-id", options); // Act

        result.Should().BeSameAs(((SuccessContent<IPCText>)contentToReturn).Document);
        getItemCommand.Verify(s => s.GetAsync<IPCText>(mode, "/requested-id", options));
        log.VerifyNothingLogged();
    }

    public static readonly IEnumerable<object[]> NotSuccessTestCases = Errors.Select(e => new object[] { e.Status, e.ExpectedError });

    [Theory, MemberData(nameof(NotSuccessTestCases))]
    public void GetRequired_ShouldThrow_IfNotSuccess(DocumentStatus status, string expectedError)
    {
        contentToReturn = TestContent.Get<IPCText>(status);

        Func<Task> act = () => target.GetRequiredAsync<IPCText>(mode, "/requested-id", options);

        act.Should().ThrowAsync<Exception>().WithMessage(expectedError);
        log.VerifyNothingLogged();
    }
}
