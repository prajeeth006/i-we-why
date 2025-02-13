using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class SitecoreLinkUrlProviderBaseTests
{
    private ISitecoreLinkUrlProvider target;
    private Mock<SitecoreLinkUrlProviderBase> underlyingMock;

    private DocumentId docId;
    private Uri url;

    public SitecoreLinkUrlProviderBaseTests()
    {
        underlyingMock = new Mock<SitecoreLinkUrlProviderBase>();
        target = underlyingMock.Object;

        docId = TestDocumentId.Get();
        url = new Uri("http://test.bwin.com/");
        underlyingMock.SetupWithAnyArgs(m => m.GetUrlAsync(default, null)).ReturnsAsync(url);
    }

    [Fact]
    public void GetUrl_ShouldDelegate()
    {
        // Act
        var result = target.GetUrl(docId);

        result.Should().BeSameAs(url);
        underlyingMock.Verify(m => m.GetUrlAsync(ExecutionMode.Sync, docId));
    }

    [Fact]
    public async Task GetUrlAsync_ShouldDelegate()
    {
        var ct = TestCancellationToken.Get();

        // Act
        var result = await target.GetUrlAsync(docId, ct);

        result.Should().BeSameAs(url);
        underlyingMock.Verify(m => m.GetUrlAsync(ExecutionMode.Async(ct), docId));
    }
}
