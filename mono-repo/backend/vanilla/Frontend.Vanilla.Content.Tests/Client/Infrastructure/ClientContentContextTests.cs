using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

public class ClientContentContextTests
{
    private ClientContentContext target;
    private Mock<IClientContentService> contentService;
    private Mock<IMenuFactory> menuFactory;
    private ContentLoadOptions options;
    private CancellationToken cancellationToken;

    public ClientContentContextTests()
    {
        contentService = new Mock<IClientContentService>();
        menuFactory = new Mock<IMenuFactory>();
        options = new ContentLoadOptions { DslEvaluation = DslEvaluation.PartialForClient, RequireTranslation = true };
        cancellationToken = TestCancellationToken.Get();
        SetupTarget();
    }

    private void SetupTarget() => target = new ClientContentContext(contentService.Object, menuFactory.Object, options, cancellationToken);

    [Fact]
    public void Constructor_ShouldExposeParameters()
    {
        target.ContentService.Should().BeSameAs(contentService.Object);
        target.MenuFactory.Should().BeSameAs(menuFactory.Object);
        target.Options.Should().Be(options);
        target.CancellationToken.Should().Be(cancellationToken);
    }

    public static IEnumerable<object[]> TestCases =>
        TestValues.Booleans.ToTestCases()
            .CombineWith(DslEvaluation.FullOnServer, DslEvaluation.PartialForClient)
            .CombineWith(0U, 1U, 666U);

    [Theory, MemberData(nameof(TestCases))]
    public void Constructor_ShouldUseZeroPrefetchDepth(
        bool requireTranslation,
        DslEvaluation dslEvaluation,
        uint prefetchDepth)
    {
        options = new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = prefetchDepth, RequireTranslation = requireTranslation };

        SetupTarget(); // Act

        target.Options.Should().Be(new ContentLoadOptions { DslEvaluation = dslEvaluation, RequireTranslation = requireTranslation });
    }

    [Fact]
    public void LoadMenuAsync_ShouldDelegateToMenuFactory()
    {
        var menuTask = Task.FromResult(new MenuItem());
        menuFactory.Setup(f => f.GetItemAsync("/test", options.DslEvaluation, cancellationToken)).Returns(menuTask);

        var task = target.LoadMenuAsync("/test"); // Act

        task.Should().BeSameAs(menuTask);
    }

    [Fact]
    public void LoadAsync_BySingleId_ShouldDelegateToContentService()
    {
        var contentTask = Task.FromResult(new ClientDocument());
        contentService.Setup(f => f.GetAsync("/test", cancellationToken, options)).Returns(contentTask);

        var task = target.LoadAsync("/test"); // Act

        task.Should().BeSameAs(contentTask);
    }

    [Fact]
    public async Task ConvertAsync_ShouldWork()
    {
        var content = new ClientDocument();
        var document = new Mock<IDocument>();
        contentService.Setup(f => f.ConvertAsync(document.Object, cancellationToken, options)).ReturnsAsync(content);

        var convertedDocument = await target.ConvertAsync(document.Object); // Act

        convertedDocument?.Should().Be(content);
    }

    [Fact]
    public void LoadAsync_ByMultipleIds_ShouldDelegateToContentService()
    {
        var ids = new DocumentId[] { "/test-1", "/test-2" };
        var contentTask = Task.FromResult(Mock.Of<IReadOnlyList<ClientDocument>>());
        contentService.Setup(f => f.GetAsync(ids, cancellationToken, options)).Returns(contentTask);

        var task = target.LoadAsync(ids); // Act

        task.Should().BeSameAs(contentTask);
    }

    private static readonly ContentParameters NotEmpty = new Dictionary<string, string> { { "x", "y" } }.AsContentParameters();

    public static IEnumerable<object[]> GetCollectionTestCases() => new[]
    {
        new object[] { null, null },
        new object[] { ContentParameters.Empty, null },
        new object[] { NotEmpty, NotEmpty },
    };

    [Theory, MemberData(nameof(GetCollectionTestCases))]
    public void CreateOptionalCollection_ShouldReturnNull_IfNullOrEmpty(ContentParameters input, ContentParameters expected)
        => target.CreateOptionalCollection(input).Should().BeSameAs(expected);

    public static readonly IEnumerable<object[]> TextTestCases = new[]
    {
        new object[] { null, null },
        new object[] { "", null },
        new object[] { "  ", null },
        new object[] { "Hello", "Hello" },
    };

    [Theory, MemberData(nameof(TextTestCases))]
    public void CreateText_ShouldConvertToNull(string input, string expected)
        => target.CreateText(input).Should().Be(expected);
}
