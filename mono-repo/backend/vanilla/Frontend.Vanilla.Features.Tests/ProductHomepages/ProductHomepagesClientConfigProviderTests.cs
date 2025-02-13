using System;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Products;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ProductHomepages;

public class ProductHomepagesClientConfigProviderTests
{
    [Fact]
    public void GetClientConfiguration_ReturnsConfig()
    {
        var contentServiceMock = new Mock<IContentService>();
        var linkMock = new Mock<ILinkTemplate>();
        linkMock.Setup(o => o.Url).Returns(new Uri("http://someurl"));
        contentServiceMock.Setup(c => c.Get<ILinkTemplate>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>()))
            .Returns(linkMock.Object);

        var provider = new ProductHomepagesClientConfigProvider(contentServiceMock.Object);

        var clientConfiguration = provider.GetClientConfigAsync(CancellationToken.None);

        clientConfiguration.Should().NotBeNull();
    }
}
