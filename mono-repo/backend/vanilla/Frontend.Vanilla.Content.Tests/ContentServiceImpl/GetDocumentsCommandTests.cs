using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetDocumentsCommandTests
{
    private IGetDocumentsCommand target;
    private Mock<IGetContentCommand> getItemCommand;
    private TestLogger<GetDocumentsCommand> log;
    private Content<IPCText> item1;
    private Content<IPCText> item2;
    private IReadOnlyList<Content<IPCText>> items;
    private ContentLoadOptions options;
    private CancellationToken ct;

    public GetDocumentsCommandTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getItemCommand = new Mock<IGetContentCommand>();
        log = new TestLogger<GetDocumentsCommand>();
        target = new GetDocumentsCommand(getItemCommand.Object, log);

        options = TestContentLoadOptions.Get();
        item1 = TestContent.Get<IPCText>(id: "/item1");
        item2 = TestContent.Get<IPCText>(id: "/item2");
        items = new[] { item1, item2 };
        ct = TestCancellationToken.Get();

        getItemCommand.Setup(s => s.GetAsync<IPCText>(ExecutionMode.Sync, item1.Id, It.IsAny<ContentLoadOptions>())).ReturnsAsync(() => item1);
        getItemCommand.Setup(s => s.GetAsync<IPCText>(ExecutionMode.Async(ct), item1.Id, It.IsAny<ContentLoadOptions>())).ReturnsAsync(() => item1);
        getItemCommand.Setup(s => s.GetAsync<IPCText>(ExecutionMode.Sync, item2.Id, It.IsAny<ContentLoadOptions>())).ReturnsAsync(() => item2);
        getItemCommand.Setup(s => s.GetAsync<IPCText>(ExecutionMode.Async(ct), item2.Id, It.IsAny<ContentLoadOptions>())).ReturnsAsync(() => item2);
    }

    private async Task<IEnumerable<IPCText>> RunTest(bool runAsync)
        => runAsync
            ? await target.GetDocumentsAsync<IPCText>(new DocumentId[] { "/item1", "/item2" }, ct, options)
            : target.GetDocuments<IPCText>(new DocumentId[] { "/item1", "/item2" }, options);

    [Theory, BooleanData]
    public async Task ShouldLoadItems(bool runAsync)
    {
        var result = await RunTest(runAsync); // Act

        // Execution should be lazy if sync
        if (!runAsync) getItemCommand.VerifyWithAnyArgs(l => l.GetAsync<IPCText>(default, null, default), Times.Never());

        result.Should().Equal(((SuccessContent<IPCText>)item1).Document, ((SuccessContent<IPCText>)item2).Document);
        log.VerifyNothingLogged();

        if (runAsync) getItemCommand.Verify(l => l.GetAsync<IPCText>(ExecutionMode.Async(ct), It.IsIn(item1.Id, item2.Id), options), Times.Exactly(2));
        else getItemCommand.Verify(l => l.GetAsync<IPCText>(ExecutionMode.Sync, It.IsIn(item1.Id, item2.Id), options), Times.Exactly(2));
    }

    [Theory, BooleanData]
    public Task ShouldSkip_IfFiltered(bool runAsync)
        => RunSkipTest(DocumentStatus.Filtered, runAsync);

    [Theory, BooleanData]
    public Task ShouldSkipAndLogError_IfInvalid(bool runAsync)
        => RunSkipTest(DocumentStatus.Invalid, runAsync, "has errors", ("errors", "Test error."));

    [Theory, BooleanData]
    public Task ShouldSkipAndLogError_IfNotFound(bool runAsync)
        => RunSkipTest(DocumentStatus.NotFound, runAsync, "not found");

    private async Task RunSkipTest(DocumentStatus status, bool runAsync, string expectedErrorSubstr = null, (string Key, string Value) expectedData = default)
    {
        item1 = TestContent.Get<IPCText>(status, item1.Id);

        var result = await RunTest(runAsync); // Act

        result.Should().Equal(((SuccessContent<IPCText>)item2).Document);

        if (expectedErrorSubstr != null)
        {
            var logErrorOrWarning = LogLevel.Error;

            if (expectedErrorSubstr == "not found")
            {
                logErrorOrWarning = LogLevel.Warning;
            }

            var logged = log.Logged.Single();
            logged.Level.Should().Be(logErrorOrWarning);
            logged.MessageFormat.Should().Contain(expectedErrorSubstr);
            logged.Data["itemId"].ToString().Should().Be("/item1");
            logged.Data["caller"].Should().NotBeNull();
            if (expectedData.Key != null) logged.Data.Should().Contain(expectedData.Key, expectedData.Value);
        }
        else
        {
            log.VerifyNothingLogged();
        }
    }
}
