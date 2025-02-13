using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentMessages;

public class ContentMessagesLoaderTests
{
    private readonly IContentMessagesLoader target;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IClosedContentMessagesCookie> cookie;
    private readonly TestLogger<ContentMessagesLoader> log;
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private static readonly DocumentId TestFolderId = new ("/content-v1.0/path", culture: new CultureInfo("sw-KE"));
    private static readonly DocumentId TestFolderId2 = new ("/content-v1.0/path2", culture: new CultureInfo("sw-KE"));
    private const string TestCookieKey = "kkk";
    private readonly CancellationToken ct;
    private IEnumerable<ClosedMessageInfo> valuesSetToCookie;

    public ContentMessagesLoaderTests()
    {
        contentService = new Mock<IContentService>();
        cookie = new Mock<IClosedContentMessagesCookie>();
        log = new TestLogger<ContentMessagesLoader>();
        clientContentService = new Mock<IVanillaClientContentService>();
        ct = TestCancellationToken.Get();
        target = new ContentMessagesLoader(contentService.Object, clientContentService.Object, cookie.Object, log);

        valuesSetToCookie = null;
        cookie.Setup(c => c.GetValues(TestCookieKey)).Returns(Array.Empty<ClosedMessageInfo>());
        cookie.Setup(c => c.SetValues(TestCookieKey, It.IsAny<IEnumerable<ClosedMessageInfo>>()))
            .Callback<TrimmedRequiredString,
                IEnumerable<ClosedMessageInfo>>((_, v) => valuesSetToCookie = v?.ToList()); // Must be copied b/c the collection is emptied in the meantime
    }

    [Theory, ValuesData(DslEvaluation.FullOnServer, DslEvaluation.PartialForClient)]
    public async Task ShouldLoadMessages(DslEvaluation dslEvaluation)
    {
        var msg1 = CreateMessage();
        var msg2 = CreateMessage();
        SetupContent(new[] { msg1, msg2 }, dslEvaluation);

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, dslEvaluation, ct); // Act

        messages.Should().Equal(msg1.Client, msg2.Client);
        cookie.VerifyWithAnyArgs(c => c.SetValues(null, null), Times.Never);
        log.VerifyNothingLogged();
        contentService.Verify(s => s.GetRequiredAsync<IDocument>(
            TestFolderId,
            ct,
            new ContentLoadOptions { DslEvaluation = DslEvaluation.FullOnServer, PrefetchDepth = 2, RequireTranslation = false }));
        contentService.Verify(s => s.GetChildrenAsync<IDocument>(It.IsNotNull<IDocument>(), ct, dslEvaluation));
    }

    [Theory]
    [InlineData(true, DslEvaluation.PartialForClient)]
    [InlineData(false, DslEvaluation.FullOnServer)]
    public async Task ShouldIncludeClosedWithFlagShowOnNextLogin_IfPartialEvaluationForClient(bool shouldBeIncluded, DslEvaluation dslEvaluation)
    {
        var msg1 = CreateMessage(itemName: "closed");
        var closedInfo = new ClosedMessageInfo("closed", false, showOnNextLogin: true);
        SetupContent(new[] { msg1 }, dslEvaluation);
        cookie.Setup(c => c.GetValues(TestCookieKey)).Returns(new[] { closedInfo, new ClosedMessageInfo("deleted", false, showOnNextLogin: true) });

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, dslEvaluation, ct); // Act

        messages.Should().Equal(shouldBeIncluded ? new[] { msg1.Client } : Array.Empty<ClientDocument>());
        valuesSetToCookie.Should().Equal(closedInfo);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldFilterOut_IfClosedMessage()
    {
        SetupContent(new[] { CreateMessage(itemName: "closed") });
        cookie.Setup(c => c.GetValues(TestCookieKey)).Returns(new[] { new ClosedMessageInfo("closed", false, false) });
        await RunAndExpectEmpty(); // Act
    }

    [Fact]
    public async Task ShouldFilterOut_IfMessagesWithoutLanguageTranslation()
    {
        SetupContent(new[] { CreateMessage(version: 0) });
        await RunAndExpectEmpty(); // Act
    }

    [Fact]
    public async Task ShouldCleanDeletedMessagesFromCookie()
    {
        var closedInfo = new ClosedMessageInfo("closed", false, false);
        SetupContent(new[] { CreateMessage(itemName: "closed") });
        cookie.Setup(c => c.GetValues(TestCookieKey)).Returns(new[] { new ClosedMessageInfo("deleted", false, false), closedInfo });

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, default, ct); // Act

        messages.Should().BeEmpty();
        valuesSetToCookie.Should().Equal(closedInfo);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotClean_IfFilteredMessagesInCookie()
    {
        SetupContent(filteredIds: new[] { new DocumentId(TestFolderId.Path + "/filtered") });
        cookie.Setup(c => c.GetValues(TestCookieKey)).Returns(new[] { new ClosedMessageInfo("filtered", false, false) });
        await RunAndExpectEmpty(); // Act
    }

    [Theory, ValuesData(DslEvaluation.PartialForClient, DslEvaluation.FullOnServer)]
    public async Task ShouldReturnEmpty_IfLoadingParentFolderFailed(DslEvaluation dslEvaluation)
    {
        var ex = new Exception();
        contentService.Setup(s => s.GetRequiredAsync<IDocument>(TestFolderId, ct, It.IsAny<ContentLoadOptions>())).Throws(ex);

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, dslEvaluation, ct); // Act

        messages.Should().BeEmpty();
        cookie.VerifyWithAnyArgs(c => c.GetValues(null), Times.Never);
        log.Logged.Single().Verify(
            LogLevel.Error,
            ex,
            ("folderId", TestFolderId),
            ("closedCookieKey", (TrimmedRequiredString)TestCookieKey));
    }

    [Theory]
    [InlineData("FALSE", "FALSE", "FALSE")] // Should be case insensitive
    [InlineData("true", "false", "false")]
    [InlineData("false", "true", "false")]
    [InlineData("false", "false", "true")]
    [InlineData("true", "true", "false")]
    [InlineData("true", "false", "true")]
    public async Task ShouldNotFilterOut_IfValidParameters(string showCloseButton, string showOnNextLogin, string showOnNextSession)
    {
        var msg = CreateMessage(showCloseButton, showOnNextLogin, showOnNextSession);
        SetupContent(new[] { msg });

        // Act
        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, DslEvaluation.FullOnServer, ct);

        messages.Should().Equal(msg.Client);
        cookie.VerifyWithAnyArgs(c => c.SetValues(null, null), Times.Never);
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(ContentMessageParameters.ShowCloseButton, "gibberish", null, null)]
    [InlineData(ContentMessageParameters.ShowOnNextLogin, null, "gibberish", null)]
    [InlineData(ContentMessageParameters.ShowOnNextSession, null, null, "gibberish")]
    public async Task ShouldFilterOut_IfInvalidParameters(string reportedParam, string showCloseButton, string showOnNextLogin, string showOnNextSession)
        => await RunFilteredOutTest(
            CreateMessage(showCloseButton, showOnNextLogin, showOnNextSession),
            verifyLoggedError: e => e.Message.Contains(reportedParam) && e.Message.Contains("gibberish")); // Act

    [Fact]
    public async Task ShouldFilterOut_IfConflictingShowOnNext()
        => await RunFilteredOutTest(
            CreateMessage(showOnNextLogin: "true", showOnNextSession: "true"),
            verifyLoggedError: e => e.Message == ContentMessagesLoader.ConflictingShowOnNext); // Act

    [Fact]
    public async Task ShouldFilterOut_IfUnsupportedContentType()
        => await RunFilteredOutTest((CreateMessage().Server, new ClientViewTemplate()),
            verifyLoggedError: e => e.Message.StartsWith("Unsupported content type " + typeof(ClientViewTemplate))); // Act

    private async Task RunFilteredOutTest((IDocument Server, ClientDocument Client) msg, Expression<Func<Exception, bool>> verifyLoggedError)
    {
        SetupContent(new[] { msg });

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, default, ct); // Act

        messages.Should().BeEmpty();
        cookie.VerifyWithAnyArgs(c => c.SetValues(null, null), Times.Never);
        log.Logged.Single().Verify(LogLevel.Error, verifyLoggedError, ("id", msg.Server.Metadata.Id));
    }

    [Fact]
    public async Task ShouldFilterOutInvalidProxyChildren()
    {
        var proxy = new ClientProxy
        {
            Rules = new[]
            {
                new ClientProxyRule { Condition = "dsl 1", Document = new ClientViewTemplate() },
                new ClientProxyRule { Condition = "dsl 2" },
                new ClientProxyRule { Condition = "dsl 3", Document = new ClientPCText { Text = "Hello" } },
            },
        };
        var serverMsg = CreateMessage().Server;
        SetupContent(new[] { (serverMsg, (ClientDocument)proxy) });

        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, default, ct); // Act

        ((ClientProxy)messages.Single()).Rules.Should().BeEquivalentOrderedTo(
            new ClientProxyRule { Condition = "dsl 1" },
            new ClientProxyRule { Condition = "dsl 2" },
            new ClientProxyRule { Condition = "dsl 3", Document = new ClientPCText { Text = "Hello" } });
        log.Logged.Single().Verify(LogLevel.Error, e => e.Message.StartsWith("Unsupported content type " + typeof(ClientViewTemplate)), ("id", serverMsg.Metadata.Id));
    }

    private async Task RunAndExpectEmpty()
    {
        var messages = await target.LoadAsync(TestFolderId, TestCookieKey, DslEvaluation.FullOnServer, ct);

        messages.Should().BeEmpty();
        cookie.VerifyWithAnyArgs(c => c.SetValues(null, null), Times.Never);
        log.VerifyNothingLogged();
    }

    private void SetupContent(
        IReadOnlyList<(IDocument Server, ClientDocument Client)> messages = null,
        DslEvaluation dslEvaluation = default,
        IEnumerable<DocumentId> filteredIds = null,
        DocumentId folderId = null)
    {
        folderId = folderId ?? TestFolderId;
        messages = messages.NullToEmpty();
        var childIds = messages.Select(m => m.Server.Metadata.Id).Concat(filteredIds ?? Array.Empty<DocumentId>()).ToArray();
        var parent = Mock.Of<IDocument>(d => d.Metadata.Id == folderId && d.Metadata.ChildIds == childIds);

        contentService.Setup(s => s.GetRequiredAsync<IDocument>(folderId, ct, new ContentLoadOptions { PrefetchDepth = 2 })).ReturnsAsync(parent);
        contentService.Setup(s => s.GetChildrenAsync<IDocument>(parent, ct, dslEvaluation)).ReturnsAsync(messages.ConvertAll(m => m.Server));

        foreach (var msg in messages)
            clientContentService.Setup(s => s.ConvertAsync(msg.Server, ct, dslEvaluation)).ReturnsAsync(msg.Client);
    }

    private static (IDocument Server, ClientDocument Client) CreateMessage(
        string showCloseButton = null,
        string showOnNextLogin = null,
        string showOnNextSession = null,
        string itemName = null,
        int version = 1)
    {
        var args = new Dictionary<string, string>()
        {
            { ContentMessageParameters.ShowCloseButton, showCloseButton },
            { ContentMessageParameters.ShowOnNextLogin, showOnNextLogin },
            { ContentMessageParameters.ShowOnNextSession, showOnNextSession },
        }.AsContentParameters();
        var id = new DocumentId(TestFolderId.Path + "/" + (itemName ?? Guid.NewGuid().ToString()), culture: TestFolderId.Culture);
        var doc = Mock.Of<IDocument>(c => c.Metadata.Id == id && c.Metadata.Version == version);
        var clientDoc = new ClientPCText { Parameters = args, Text = "Hello" };

        return (doc, clientDoc);
    }

    [Fact]
    public async Task ShouldLoadDictionaryOfMessages()
    {
        var msg1 = CreateMessage();
        var msg2 = CreateMessage();
        var msg3 = CreateMessage();
        SetupContent(new[] { msg1, msg2 });
        SetupContent(new[] { msg3 }, DslEvaluation.PartialForClient, folderId: TestFolderId2);
        var folder1 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId && f.Metadata.ChildIds == new[] { msg1.Server.Metadata.Id, msg2.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c1" }, { "dsl-evaluation", "server" } }.AsContentParameters());
        var folder2 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId2 && f.Metadata.ChildIds == new[] { msg3.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c2" }, { "dsl-evaluation", "client" } }.AsContentParameters());
        contentService.Setup(s => s.GetChildrenAsync<IGenericListItem>("root", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { folder1, folder2 });

        var dictionary = await target.LoadDictionaryAsync("root", ct); // Act

        log.VerifyNothingLogged();
        dictionary["path"].Should().BeEquivalentTo(msg1.Client, msg2.Client);
        dictionary["path2"].Should().BeEquivalentTo(msg3.Client);
    }

    [Fact]
    public async Task ShouldReturnEmptyCollectionAndLogIfClosedCookieKeyIsNotSpecified()
    {
        var msg1 = CreateMessage();
        var msg2 = CreateMessage();
        var msg3 = CreateMessage();
        SetupContent(new[] { msg1, msg2 });
        SetupContent(new[] { msg3 }, DslEvaluation.PartialForClient, folderId: TestFolderId2);
        var folder1 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId && f.Metadata.ChildIds == new[] { msg1.Server.Metadata.Id, msg2.Server.Metadata.Id } &&
            f.SharedList == new Dictionary<string, string> { { "dsl-evaluation", "server" } }.AsContentParameters());
        var folder2 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId2 && f.Metadata.ChildIds == new[] { msg3.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c2" }, { "dsl-evaluation", "client" } }.AsContentParameters());
        contentService.Setup(s => s.GetChildrenAsync<IGenericListItem>("root", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { folder1, folder2 });

        var dictionary = await target.LoadDictionaryAsync("root", ct); // Act

        log.Logged[0].Verify(LogLevel.Error, ("id", TestFolderId), ("error", "missing parameter closed-cookie-key"));
        dictionary["path"].Should().BeEmpty();
        dictionary["path2"].Should().BeEquivalentTo(msg3.Client);
    }

    [Fact]
    public async Task ShouldReturnEmptyCollectionAndLogIfDslEvaluationIsNotSpecified()
    {
        var msg1 = CreateMessage();
        var msg2 = CreateMessage();
        var msg3 = CreateMessage();
        SetupContent(new[] { msg1, msg2 });
        SetupContent(new[] { msg3 }, DslEvaluation.PartialForClient, folderId: TestFolderId2);
        var folder1 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId && f.Metadata.ChildIds == new[] { msg1.Server.Metadata.Id, msg2.Server.Metadata.Id } &&
            f.SharedList == new Dictionary<string, string> { { "closed-cookie-key", "c1" } }.AsContentParameters());
        var folder2 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId2 && f.Metadata.ChildIds == new[] { msg3.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c2" }, { "dsl-evaluation", "client" } }.AsContentParameters());
        contentService.Setup(s => s.GetChildrenAsync<IGenericListItem>("root", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { folder1, folder2 });

        var dictionary = await target.LoadDictionaryAsync("root", ct); // Act

        log.Logged[0].Verify(LogLevel.Error, ("id", TestFolderId), ("error", "missing parameter dsl-evaluation"));
        dictionary["path"].Should().BeEmpty();
        dictionary["path2"].Should().BeEquivalentTo(msg3.Client);
    }

    [Fact]
    public async Task ShouldReturnEmptyCollectionAndLogIfDslEvaluationIsInvalid()
    {
        var msg1 = CreateMessage();
        var msg2 = CreateMessage();
        var msg3 = CreateMessage();
        SetupContent(new[] { msg1, msg2 });
        SetupContent(new[] { msg3 }, DslEvaluation.PartialForClient, folderId: TestFolderId2);
        var folder1 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId && f.Metadata.ChildIds == new[] { msg1.Server.Metadata.Id, msg2.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c1" }, { "dsl-evaluation", "rubbish" } }.AsContentParameters());
        var folder2 = Mock.Of<IGenericListItem>(f =>
            f.Metadata.Id == TestFolderId2 && f.Metadata.ChildIds == new[] { msg3.Server.Metadata.Id } && f.SharedList ==
            new Dictionary<string, string> { { "closed-cookie-key", "c2" }, { "dsl-evaluation", "client" } }.AsContentParameters());
        contentService.Setup(s => s.GetChildrenAsync<IGenericListItem>("root", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { folder1, folder2 });

        var dictionary = await target.LoadDictionaryAsync("root", ct); // Act

        log.Logged[0].Verify(LogLevel.Error, ("id", TestFolderId), ("error", "invalid dsl-evaluation value rubbish. Allowed values are: server, client"));
        dictionary["path"].Should().BeEmpty();
        dictionary["path2"].Should().BeEquivalentTo(msg3.Client);
    }
}
