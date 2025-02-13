using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetPrefetchedDocumentCommandTests
{
    private IGetPrefetchedDocumentCommand target;
    private Mock<IGetPrefetchedContentCommand> getItemCommand;
    private TestLogger<GetPrefetchedDocumentCommand> log;

    private ExecutionMode mode;
    private ContentLoadOptions options;
    private IEnumerable<Content<IPCText>> contentToReturn;

    public GetPrefetchedDocumentCommandTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getItemCommand = new Mock<IGetPrefetchedContentCommand>();
        log = new TestLogger<GetPrefetchedDocumentCommand>();
        target = new GetPrefetchedDocumentCommand(getItemCommand.Object, log);

        mode = TestExecutionMode.Get();
        options = TestContentLoadOptions.Get();
        contentToReturn = new[] { TestContent.Get<IPCText>(), TestContent.Get<IPCText>() };
        getItemCommand.SetupWithAnyArgs(s => s.GetAsync<IPCText>(default, null, default)).ReturnsAsync(contentToReturn);
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
        contentToReturn = contentToReturn = new[] { TestContent.Get<IPCText>(status), TestContent.Get<IPCText>() };

        var result = await target.GetAsync<IPCText>(mode, "/requested-id", options); // Act

        foreach (var item in result)
        {
            item.Should().Be(item);
        }
        getItemCommand.Verify(s => s.GetAsync<IPCText>(mode, "/requested-id", options));
        log.VerifyNothingLogged();
    }
}
