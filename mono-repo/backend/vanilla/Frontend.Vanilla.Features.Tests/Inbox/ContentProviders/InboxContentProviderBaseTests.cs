#nullable disable
using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Inbox.ContentProviders;

public class InboxOfferTest : IInboxOffer
{
    public IDocumentMetadata Metadata { get; set; }
    public DocumentData Data { get; set; }
    public UtcDateTime ValidUpTo { get; set; }
    public string DetailCallToAction { get; set; }
    public string DetailDescription { get; set; }
    public ContentImage DetailImage { get; set; }
    public string DetailTitle { get; set; }
    public bool ExpandTermsAndConditionsByDefault { get; }
    public ContentLink ImageLink { get; set; }
    public string InboxImageIntroductoryText { get; }
    public string InboxImageSubtitleText { get; }
    public string InboxImageTextAlignment { get; }
    public string InboxImageTitleFontSize { get; }
    public string InboxImageTitleText { get; }
    public DocumentId InboxLayout { get; }
    public string ManualTermsAndConditions { get; }
    public ContentImage ShortImage { get; set; }
    public bool ShowManualTermsAndConditions { get; }
    public string SnippetCallToAction { get; set; }
    public string SnippetDescription { get; set; }
    public string SnippetTitle { get; set; }
    public string OverlayHeaderType { get; set; }
    public string OverlayCTA { get; set; }
    public string OverLayDescription { get; set; }
    public ContentImage OverlayImage { get; set; }
    public string OverlayImageIntroductoryText { get; }
    public string OverlayImageSubtitleText { get; }
    public string OverlayImageTextAlignment { get; }
    public string OverlayImageTitleFontSize { get; }
    public string OverlayImageTitleText { get; }
    public DocumentId OverlayLayout { get; }
    public string OverlayManualTermsAndConditions { get; }
    public string OverlayTitle { get; set; }
    public bool RestrictedOverlay { get; set; }
    public DocumentId RewardsOverlayLayout { get; }
    public ContentLink PostAcceptanceCTA { get; }
    public string PostAcceptanceDescription { get; }
    public string PostAcceptanceHeaderTitle { get; }
    public ContentImage PostAcceptanceImage { get; }
    public string PostAcceptanceImageIntroductoryText { get; }
    public string PostAcceptanceImageSubtitleText { get; }
    public string PostAcceptanceImageTextAlignment { get; }
    public string PostAcceptanceImageTitleFontSize { get; }
    public string PostAcceptanceImageTitleText { get; }
    public string PostAcceptanceTitle { get; }
    public ContentLink PreAcceptanceCTA1 { get; }
    public ContentLink PreAcceptanceCTA2 { get; }
    public string PreAcceptanceDescription { get; }
    public string PreAcceptanceHeaderTitle { get; }
    public ContentImage PreAcceptanceImage { get; }
    public string PreAcceptanceImageIntroductoryText { get; }
    public string PreAcceptanceImageSubtitleText { get; }
    public string PreAcceptanceImageTextAlignment { get; }
    public string PreAcceptanceImageTitleFontSize { get; }
    public string PreAcceptanceImageTitleText { get; }
    public string PreAcceptanceKeyTerms { get; }
    public string PreAcceptanceTitle { get; }
    public bool ShowManualTermsAndConditionsOnOverlay { get; }
    public bool ToasterCloseWithTimer { get; }
    public string ToasterCTA { get; set; }
    public string ToasterPrimaryGhostCTA { get; set; }
    public string ToasterCloseCTALabel { get; set; }
    public string ToasterDescription { get; set; }
    public DocumentId ToasterLayout { get; }
    public string ToasterTitle { get; }
    public ContentImage TosterImage { get; set; }
    public bool UseRewardsOverlay { get; }
    public string OptimoveInstance { get; }
    public string HeaderTermsAndConditionsInbox { get; }
    public string HeaderTermsAndConditionsToaster { get; }
    public ContentLink CTANativeLink { get; }
    public string HeaderTermsAndConditionsOverlay { get; }
    public string HeaderTermsAndConditionsRewardsOverlay { get; }
}

public class InboxContentProviderBaseTests
{
    private readonly InboxContentProviderBase inboxContentProviderBase;
    private readonly Mock<IContentService> contentServiceMock;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;
    private readonly DocumentId testDocumentId;
    private readonly InboxOfferTest inboxOfferTest;
    private readonly Tuple<string, string> testKeyValue;
    private readonly Tuple<string, string> testKeyValueDate;
    private readonly Tuple<string, string> testKeyValueFinalDate;
    private readonly List<InboxMessage> testInboxMessages;
    private const string TestTemplateId = "templateId";

    public InboxContentProviderBaseTests()
    {
        contentServiceMock = new Mock<IContentService>();
        testKeyValue = new Tuple<string, string>("*MyTestKey*", "[MyKeyValue]");
        testKeyValueDate = new Tuple<string, string>("#FORMAT_DATE_CREATION_DATE#", "31/03/2019 11:59 PM_CET");
        testKeyValueFinalDate = new Tuple<string, string>("#CREATION_DATE#", "31.03.2019 23:59 CET");
        testInboxMessages = new List<InboxMessage>
        {
            new (sourceStatus: "OFFER_NEW", messageType: "BONUS_OFFER", templateMetaData: new List<KeyValuePair<string, string>>
            {
                new (testKeyValue.Item1, testKeyValue.Item2),
                new (testKeyValueDate.Item1, testKeyValueDate.Item2),
            }),
        };

        inboxOfferTest = new InboxOfferTest
        {
            DetailTitle = $"DetailTitle {testKeyValue.Item1} {testKeyValueFinalDate.Item1}",
            DetailDescription = $"DetailDescription {testKeyValue.Item1}",
            SnippetTitle = $"SnippetTitle {testKeyValue.Item1}",
            SnippetDescription = $"SnippetDescription {testKeyValue.Item1}",

            DetailImage = SetupImageMock("Src1"),
            ImageLink = SetupImageLinkMock(new Uri("http://bwin.com/en/test/"),
                "imageText",
                new ContentParameters(new[] { new KeyValuePair<string, string>("attr", "newAttribute") })),
            DetailCallToAction = "DetailCallToAction",
            ShortImage = SetupImageMock("Src2"),
            SnippetCallToAction = "SnippetCallToAction",

            ToasterDescription = "ToasterDescription",
            ToasterCTA = "ToasterCallToAction",
            TosterImage = SetupImageMock("Src"),

            OverlayTitle = "Title",
            OverLayDescription = "OverlayDescription",
            OverlayCTA = "ToasterCallToAction",
            OverlayImage = SetupImageMock("Src"),
            Metadata = SetupMetaDataMock("Metadata"),
        };

        testDocumentId = new DocumentId(TestTemplateId, DocumentPathRelativity.AbsoluteRoot);

        contentServiceMock.Setup(x => x.Get<IDocument>(testDocumentId, It.IsAny<ContentLoadOptions>()))
            .Returns(inboxOfferTest);

        var templateMock = new Mock<IViewTemplate>();
        templateMock.Setup(o => o.Title).Returns("SampleTitle");
        templateMock.Setup(o => o.Text).Returns("Your requested new limits will be available after a waiting period of {0}");
        templateMock.Setup(o => o.Messages).Returns(new Dictionary<string, string> { { "VERIFIED", "Test verified" } }.AsContentParameters());
        templateMock.Setup(o => o.Metadata).Returns(SetupMetaDataMock("MetaData"));

        contentServiceMock.Setup(x => x.Get<IViewTemplate>("MobileLogin-v1.0/Common/Static/StaticKeyValues", It.IsAny<ContentLoadOptions>()))
            .Returns(templateMock.Object);

        var nativeAppServiceMock = new Mock<INativeAppService>();
        nativeAppServiceMock.Setup(x => x.GetCurrentDetails()).Returns(NativeAppDetails.Unknown);

        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();
        dateTimeCultureBasedFormatter.Setup(x => x.Format(It.IsAny<DateTime>(), It.IsAny<string>())).Returns("31.03.2019 23:59");

        inboxContentProviderBase = new InboxContentProviderBase(contentServiceMock.Object, new Mock<ILogger>().Object, dateTimeCultureBasedFormatter.Object);
    }

    [Fact]
    public void GetContent()
    {
        var result = inboxContentProviderBase.GetContent(TestTemplateId, testInboxMessages[0].TemplateMetaData);

        result.DetailTitle.Should().Be(inboxOfferTest.DetailTitle?.Replace(testKeyValue.Item1, testKeyValue.Item2)
            .Replace(testKeyValueFinalDate.Item1, testKeyValueFinalDate.Item2));
        result.DetailDescription.Should().Be(inboxOfferTest.DetailDescription?.Replace(testKeyValue.Item1, testKeyValue.Item2));
        result.SnippetTitle.Should().Be(inboxOfferTest.SnippetTitle?.Replace(testKeyValue.Item1, testKeyValue.Item2));
        result.SnippetDescription.Should().Be(inboxOfferTest.SnippetDescription?.Replace(testKeyValue.Item1, testKeyValue.Item2));

        result.DetailImage.DetailImage.Should().Be(inboxOfferTest.DetailImage?.Src);
        result.DetailImage.DetailImageLink.Should().Be(inboxOfferTest.ImageLink?.Url.ToString());
        result.DetailImage.DetailImageAttrs.Should().BeEquivalentTo(inboxOfferTest.ImageLink?.Attributes);
        result.DetailCallToAction.Should().Be(inboxOfferTest.DetailCallToAction);
        result.ShortImage.Should().Be(inboxOfferTest.ShortImage?.Src);
        result.SnippetCallToAction.Should().Be(inboxOfferTest.SnippetCallToAction);
    }

    private static ContentImage SetupImageMock(string src)
    {
        return new ContentImage(src, null, null, null);
    }

    private static ContentLink SetupImageLinkMock(Uri uri, string text, ContentParameters attributes)
    {
        return new ContentLink(uri, text, attributes);
    }

    private static IDocumentMetadata SetupMetaDataMock(string src)
    {
        var mock = new Mock<IDocumentMetadata>();
        mock.Setup(o => o.Id).Returns(src);

        return mock.Object;
    }
}
