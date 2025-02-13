using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.RtmsLayer;
using Frontend.Vanilla.Features.TermsAndConditions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Rtms;

public class BonusTeaserContentProviderTests
{
    private readonly IBonusTeaserContentProvider target;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<ITermsAndConditionsContentProvider> termsAncConditionsContentProvider;
    private readonly Mock<IRtmsLayerConfiguration> rtmsLayerConfiguration;
    private readonly Mock<ILogger<IBonusTeaserContentProvider>> logMock;
    private Mock<IPCContainer> document;
    private Content<IPCContainer> contentResult;
    private Mock<IDocumentMetadata> metadata;

    public BonusTeaserContentProviderTests()
    {
        contentService = new Mock<IContentService>();
        termsAncConditionsContentProvider = new Mock<ITermsAndConditionsContentProvider>();
        rtmsLayerConfiguration = new Mock<IRtmsLayerConfiguration>();
        logMock = new Mock<ILogger<IBonusTeaserContentProvider>>();

        target = new BonusTeaserContentProvider(contentService.Object, termsAncConditionsContentProvider.Object, rtmsLayerConfiguration.Object, logMock.Object);
        SetupMocks();
    }

    [Fact]
    public void ShouldGerBonusContent_FromBonusSectionTemplate()
    {
        var result = target.GetBonusContent(new Dictionary<string, string>()
        {
            { "#BONUS_TEASER_TEMPLATE#", "Bonus_Teaser" },
        });

        result.BonusHeader.Should().Be("Header text");
        result.BonusText.Should().Be("Content text");
        result.BonusImage.Src.Should().Be("http://test");
    }

    [Fact]
    public void ShouldGetBonusContent_FromBonusSectionByTemplateId()
    {
        var result = target.GetBonusContent(new Dictionary<string, string>()
        {
            { "#BONUS_TEASER_TEMPLATE#", "Bonus_Taser" },
        });

        result.BonusHeader.Should().Be("Header text");
        result.BonusText.Should().Be("Content text");
        result.BonusImage.Src.Should().Be("http://test");
    }

    private void SetupMocks()
    {
        rtmsLayerConfiguration.SetupGet(o => o.BonusSectionTemplate).Returns("/Content/BonusTeaser/{0}");
        rtmsLayerConfiguration.SetupGet(o => o.BonusSectionByTemplateId).Returns(new Dictionary<string, string>
        {
            { "Bonus_Taser", "/Content/BonusTeaser/Bonus_Teaser" },
        });
        var ids = new DocumentId[] { "/id/image", "/id/header", "/id/content" };

        document = new Mock<IPCContainer>();
        document.Setup(o => o.Items).Returns(ids);
        metadata = new Mock<IDocumentMetadata>();
        metadata.SetupGet(m => m.Id).Returns("/Content/BonusTeaser/");
        document.SetupGet(d => d.Metadata).Returns(metadata.Object);

        var image = new Mock<IPCImage>();
        var metadataImage = new Mock<IDocumentMetadata>();
        metadataImage.SetupGet(m => m.Id).Returns("/id/image");
        metadataImage.SetupGet(m => m.Version).Returns(2);
        image.SetupGet(d => d.Metadata).Returns(metadataImage.Object);
        image.SetupGet(i => i.Image).Returns(new ContentImage("http://test", "", 50, 60));

        var header = new Mock<IPCText>();
        var metadataHeader = new Mock<IDocumentMetadata>();
        metadataHeader.SetupGet(m => m.Id).Returns("/id/header");
        metadataHeader.SetupGet(m => m.Version).Returns(2);
        header.SetupGet(d => d.Metadata).Returns(metadataHeader.Object);
        header.SetupGet(h => h.Title).Returns("Header");
        header.SetupGet(h => h.Text).Returns("Header text");

        var content = new Mock<IPCText>();
        var metadataContent = new Mock<IDocumentMetadata>();
        metadataContent.SetupGet(m => m.Id).Returns("/id/header");
        metadataContent.SetupGet(m => m.Version).Returns(2);
        content.SetupGet(d => d.Metadata).Returns(metadataContent.Object);
        content.SetupGet(h => h.Title).Returns("Content");
        content.SetupGet(h => h.Text).Returns("Content text");

        contentResult = new SuccessContent<IPCContainer>(document.Object);
        contentService.Setup(o => o.GetContent<IPCContainer>("/Content/BonusTeaser/Bonus_Teaser", It.IsAny<ContentLoadOptions>())).Returns(() => contentResult);
        contentService.Setup(o => o.GetContent<IPCImage>("/id/image", It.IsAny<ContentLoadOptions>())).Returns(() => new SuccessContent<IPCImage>(image.Object));
        contentService.Setup(o => o.GetContent<IPCText>("/id/header", It.IsAny<ContentLoadOptions>())).Returns(() => new SuccessContent<IPCText>(header.Object));
        contentService.Setup(o => o.GetContent<IPCText>("/id/content", It.IsAny<ContentLoadOptions>())).Returns(() => new SuccessContent<IPCText>(content.Object));
        termsAncConditionsContentProvider.Setup(o => o.ParseTemplateAndReplacePlaceholders(It.IsAny<IEnumerable<KeyValuePair<string, string>>>(), "Header text"))
            .Returns("Header text");
        termsAncConditionsContentProvider.Setup(o => o.ParseTemplateAndReplacePlaceholders(It.IsAny<IEnumerable<KeyValuePair<string, string>>>(), "Content text"))
            .Returns("Content text");
    }
}
