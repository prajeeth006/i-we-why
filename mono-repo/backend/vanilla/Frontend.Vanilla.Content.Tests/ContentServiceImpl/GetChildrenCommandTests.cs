using System;
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
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetChildrenCommandTests
{
    private IGetChildrenCommand target;
    private Mock<IGetContentCommand> getItemCommand;
    private Mock<IGetPrefetchedDocumentCommand> getPrefectchedDocumentCommand;
    private Mock<IGetDocumentsCommand> getDocumentsCommand;
    private TestLogger<GetChildrenCommand> log;

    private ContentLoadOptions options;
    private Content<IDocument> parentContent;
    private IDocument parentDocument;
    private IReadOnlyList<IPCText> childItems;
    private IDocumentMetadata parentMetadata;
    private CancellationToken ct;

    public GetChildrenCommandTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getItemCommand = new Mock<IGetContentCommand>();
        getPrefectchedDocumentCommand = new Mock<IGetPrefetchedDocumentCommand>();

        getDocumentsCommand = new Mock<IGetDocumentsCommand>();
        log = new TestLogger<GetChildrenCommand>();
        target = new GetChildrenCommand(getItemCommand.Object, getPrefectchedDocumentCommand.Object, getDocumentsCommand.Object, log);

        options = TestContentLoadOptions.Get();
        parentMetadata = Mock.Of<IDocumentMetadata>(m => m.Id == (DocumentId)"/parent" && m.ChildIds == new DocumentId[] { "/child1", "/child2" });
        parentDocument = Mock.Of<IDocument>();
        parentContent = TestContent.Get<IDocument>(metadata: parentMetadata, document: parentDocument);
        childItems = new[] { Mock.Of<IPCText>(), Mock.Of<IPCText>() };
        ct = TestCancellationToken.Get();

        getItemCommand.SetupWithAnyArgs(s => s.GetAsync<IDocument>(default, null, default)).ReturnsAsync(() => parentContent);
        getDocumentsCommand.SetupWithAnyArgs(s => s.GetDocuments<IPCText>(null, default)).Returns(childItems);
        getDocumentsCommand.SetupWithAnyArgs(s => s.GetDocumentsAsync<IPCText>(null, default, default)).ReturnsAsync(childItems);
    }

    private async Task<IEnumerable<IPCText>> Target_GetByParentId(bool runAsync)
        => runAsync
            ? await target.GetByParentIdAsync<IPCText>("/parent", ct, options)
            : target.GetByParentId<IPCText>("/parent", options);

    public static IEnumerable<object[]> TestCases =>
        TestValues.Booleans.ToTestCases()
            .CombineWith(DocumentStatus.Success, DocumentStatus.Invalid)
            .CombineWith(new object[] { DslEvaluation.PartialForClient, DslEvaluation.FullOnServer })
            .CombineWith(TestValues.Booleans)
            .CombineWith((0U, 1U), (1U, 1U), (666U, 666U));

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetByParentId_ShouldGetChildren(
        bool runAsync,
        DocumentStatus parentStatus,
        DslEvaluation dslEvaluation,
        bool requiredTranslation,
        (uint Input, uint ExpectedForParent) prefetchDepth)
    {
        options = new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = prefetchDepth.Input, RequireTranslation = requiredTranslation };
        parentContent = TestContent.Get<IDocument>(parentStatus, metadata: parentMetadata);

        var result = await Target_GetByParentId(runAsync); // Act

        result.Should().BeSameAs(childItems); // Same means not-enumerated-yet
        log.VerifyNothingLogged();
        var expectedParentOptions = new ContentLoadOptions { PrefetchDepth = prefetchDepth.ExpectedForParent };

        if (runAsync)
        {
            getItemCommand.Verify(l => l.GetAsync<IDocument>(ExecutionMode.Async(ct), "/parent", expectedParentOptions));
            getDocumentsCommand.Verify(l => l.GetDocumentsAsync<IPCText>(new DocumentId[] { "/child1", "/child2" }, ct, options));
        }
        else
        {
            getItemCommand.Verify(l => l.GetAsync<IDocument>(ExecutionMode.Sync, "/parent", expectedParentOptions));
            getDocumentsCommand.Verify(l => l.GetDocuments<IPCText>(new DocumentId[] { "/child1", "/child2" }, options));
        }
    }

    [Theory, BooleanData]
    public Task GetByParentId_ShouldReturnEmpty_IfNoChildIds(bool runAsync)
    {
        Mock.Get(parentMetadata).SetupGet(m => m.ChildIds).Returns(Array.Empty<DocumentId>());

        return RunEmptyTest(runAsync);
    }

    [Theory, BooleanData]
    public Task GetByParentId_ShouldReturnEmpty_IfParentFilteredOut(bool runAsync)
    {
        parentContent = new FilteredContent<IDocument>(parentMetadata);

        return RunEmptyTest(runAsync);
    }

    [Theory, BooleanData]
    public Task GetByParentId_ShouldReturnEmpty_IfParentNotFound(bool runAsync)
    {
        parentContent = new NotFoundContent<IDocument>(parentMetadata.Id);

        return RunEmptyTest(runAsync, "/parent - sw-KE");
    }

    private async Task RunEmptyTest(bool runAsync, string errorItem = null)
    {
        var result = await Target_GetByParentId(runAsync); // Act

        result.Should().BeEmpty();
        getDocumentsCommand.VerifyWithAnyArgs(s => s.GetDocuments<IPCText>(null, default), Times.Never);
        getDocumentsCommand.VerifyWithAnyArgs(s => s.GetDocumentsAsync<IPCText>(null, default, default), Times.Never);

        if (errorItem != null)
        {
            var logged = log.Logged.Single();
            logged.Level.Should().Be(LogLevel.Error);
            logged.Data.Keys.Should().Equal("parentId", "caller");
            logged.Data["parentId"].ToString().Should().Be(errorItem);
        }
        else
        {
            log.VerifyNothingLogged();
        }
    }

    [Fact]
    public void GetByParentDocument_ShouldReturnDocumentsByChildIds()
    {
        var result = target.GetByParentDocument<IPCText>(parentDocument, options); // Act

        result.Should().BeSameAs(childItems);
        getDocumentsCommand.Verify(l => l.GetDocuments<IPCText>(new DocumentId[] { "/child1", "/child2" }, options));
    }

    [Fact]
    public async Task GetByParentDocumentAsync_ShouldReturnDocumentsByChildIds()
    {
        var result = await target.GetByParentDocumentAsync<IPCText>(parentDocument, ct, options); // Act

        result.Should().BeSameAs(childItems);
        getDocumentsCommand.Verify(l => l.GetDocumentsAsync<IPCText>(new DocumentId[] { "/child1", "/child2" }, ct, options));
    }
}
