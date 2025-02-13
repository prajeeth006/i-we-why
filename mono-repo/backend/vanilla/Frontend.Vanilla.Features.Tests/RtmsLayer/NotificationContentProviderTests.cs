#nullable disable
using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.RtmsLayer;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RtmsLayer;

public class NotificationTest : INotification
{
    public IDocumentMetadata Metadata { get; set; }
    public DocumentData Data { get; set; }
    public string OverlayHeaderType { get; set; }
    public string OverlayCTA { get; set; }
    public string OverLayDescription { get; set; }
    public ContentImage OverlayImage { get; set; }
    public string OverlayImageSubtitleText { get; }
    public string OverlayImageTextAlignment { get; }
    public string OverlayImageIntroductoryText { get; }
    public string OverlayImageTitleFontSize { get; }
    public string OverlayImageTitleText { get; }
    public DocumentId OverlayLayout { get; }
    public string OverlayManualTermsAndConditions { get; set; }
    public string OverlayTitle { get; set; }
    public bool RestrictedOverlay { get; set; }
    public DocumentId RewardsOverlayLayout { get; }
    public ContentLink PostAcceptanceCTA { get; set; }
    public string PostAcceptanceDescription { get; set; }
    public string PostAcceptanceHeaderTitle { get; set; }
    public ContentImage PostAcceptanceImage { get; set; }
    public string PostAcceptanceImageIntroductoryText { get; }
    public string PostAcceptanceImageSubtitleText { get; }
    public string PostAcceptanceImageTextAlignment { get; }
    public string PostAcceptanceImageTitleFontSize { get; }
    public string PostAcceptanceImageTitleText { get; }
    public string PostAcceptanceTitle { get; set; }
    public ContentLink PreAcceptanceCTA1 { get; set; }
    public ContentLink PreAcceptanceCTA2 { get; set; }
    public string PreAcceptanceDescription { get; set; }
    public string PreAcceptanceHeaderTitle { get; set; }
    public ContentImage PreAcceptanceImage { get; set; }
    public string PreAcceptanceImageIntroductoryText { get; }
    public string PreAcceptanceImageSubtitleText { get; }
    public string PreAcceptanceImageTextAlignment { get; }
    public string PreAcceptanceImageTitleFontSize { get; }
    public string PreAcceptanceImageTitleText { get; }
    public string PreAcceptanceKeyTerms { get; set; }
    public string PreAcceptanceTitle { get; set; }
    public bool ShowManualTermsAndConditionsOnOverlay { get; set; }
    public bool ToasterCloseWithTimer { get; set; }
    public string ToasterCTA { get; set; }
    public string ToasterPrimaryGhostCTA { get; set; }
    public string ToasterCloseCTALabel { get; set; }
    public string ToasterDescription { get; set; }
    public DocumentId ToasterLayout { get; }
    public string ToasterTitle { get; }
    public ContentImage TosterImage { get; set; }
    public bool UseRewardsOverlay { get; set; }
    public string HeaderTermsAndConditionsToaster { get; }
    public ContentLink CTANativeLink { get; }
    public string HeaderTermsAndConditionsOverlay { get; }
    public string HeaderTermsAndConditionsRewardsOverlay { get; }

    public Dictionary<string, string> TemplateMetaData { get; set; }
}

public class NotificationContentProviderTests
{
    private readonly NotificationContentProvider notificationContentProvider;
    private readonly Mock<IContentService> contentServiceMock;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;
    private readonly NotificationTest notificationTest;
    private readonly DocumentId testDocumentId;
    private readonly Tuple<string, string> testKeyValue;
    private readonly List<NotificationTest> notificationMessages;
    private readonly string testTemplateId = "templateId";

    public NotificationContentProviderTests()
    {
        testKeyValue = new Tuple<string, string>("*MyTestKey*", "[MyKeyValue]");

        notificationMessages = new List<NotificationTest>
        {
            new ()
            {
                TemplateMetaData = new Dictionary<string, string>()
                {
                    { testKeyValue.Item1, testKeyValue.Item2 },
                },
            },
        };

        notificationTest = new NotificationTest()
        {
            ToasterDescription = "ToasterDescription",
            ToasterCTA = "ToasterCallToAction",
            TosterImage = new ContentImage("Src", null, null, null),
            ToasterCloseWithTimer = true,
            OverlayHeaderType = "Default",
            OverlayTitle = "Title",
            OverLayDescription = "OverlayDescription",
            OverlayCTA = "ToasterCallToAction",
            OverlayImage = new ContentImage("Src", null, null, null),
            PreAcceptanceHeaderTitle = "PreAcceptanceHeaderTitle",
            PreAcceptanceImage = new ContentImage("Src", null, null, null),
            PreAcceptanceTitle = "PreAcceptanceTitle",
            PreAcceptanceDescription = "PreAcceptanceDescription",
            PreAcceptanceKeyTerms = "PreAcceptanceKeyTerms",
            PreAcceptanceCTA1 = new ContentLink(new Uri("http://same.as.me/youhavetogohere?bla=1"),
                "linkText",
                new Dictionary<string, string> { { "href", "http://same.as.me/youhavetogohere?bla=1" } }.AsContentParameters()),
            PreAcceptanceCTA2 = new ContentLink(new Uri("http://same.as.me/youhavetogohere?bla=1"),
                "linkText",
                new Dictionary<string, string> { { "href", "http://same.as.me/youhavetogohere?bla=1" } }.AsContentParameters()),
            PostAcceptanceImage = new ContentImage("Src", null, null, null),
            PostAcceptanceHeaderTitle = "PostAcceptanceHeaderTitle",
            PostAcceptanceDescription = "PostAcceptanceDescription",
            PostAcceptanceTitle = "PostAcceptanceTitle",
            PostAcceptanceCTA = new ContentLink(new Uri("http://same.as.me/youhavetogohere?bla=1"),
                "linkText",
                new Dictionary<string, string> { { "href", "http://same.as.me/youhavetogohere?bla=1" } }.AsContentParameters()),
            OverlayManualTermsAndConditions = "OverlayManualTermsAndConditions",
            ShowManualTermsAndConditionsOnOverlay = false,
            UseRewardsOverlay = true,
            Metadata = SetupMetaDataMock("Metadata"),
        };

        testDocumentId = new DocumentId(testTemplateId, DocumentPathRelativity.AbsoluteRoot);

        contentServiceMock = new Mock<IContentService>();
        contentServiceMock.Setup(x => x.Get<IDocument>(testDocumentId, It.IsAny<ContentLoadOptions>()))
            .Returns(notificationTest);

        var templateMock = new Mock<IViewTemplate>();
        templateMock.Setup(o => o.Title).Returns("SampleTitle");
        templateMock.Setup(o => o.Text).Returns("Your requested new limits will be available after a waiting period of {0}");
        templateMock.Setup(o => o.Messages).Returns(new Dictionary<string, string> { { "VERIFIED", "Test verified" } }.AsContentParameters());
        templateMock.SetupGet(o => o.Metadata.Id).Returns("MetaData");

        contentServiceMock.Setup(x => x.Get<IViewTemplate>(AppPlugin.ObsoleteContentRoot + "/Common/Static/StaticKeyValues", It.IsAny<ContentLoadOptions>()))
            .Returns(templateMock.Object);

        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();

        notificationContentProvider =
            new NotificationContentProvider(contentServiceMock.Object, new TestLogger<NotificationContentProvider>(), dateTimeCultureBasedFormatter.Object);
    }

    [Fact]
    public void GetNotificationContent()
    {
        var result = notificationContentProvider.GetContent(testTemplateId, notificationMessages[0].TemplateMetaData);

        result.ToasterTitle.Should().Be(notificationTest.ToasterTitle);
        result.ToasterDescription.Should().Be(notificationTest.ToasterDescription);
        result.ToasterCallToAction.Should().Be(notificationTest.ToasterCTA);
        result.ToasterPrimaryGhostCallToAction.Should().Be(notificationTest.ToasterPrimaryGhostCTA);
        result.ToasterCloseCallToActionLabel.Should().Be(notificationTest.ToasterCloseCTALabel);
        result.TosterImage.Should().Be(notificationTest.TosterImage?.Src);
        result.ToasterCloseAfterTimeout.Should().Be(notificationTest.ToasterCloseWithTimer);

        result.OverlayHeaderType.Should().Be(notificationTest.OverlayHeaderType);
        result.OverlayTitle.Should().Be(notificationTest.OverlayTitle);
        result.OverlayDescription.Should().Be(notificationTest.OverLayDescription);
        result.OverlayCallToAction.Should().Be(notificationTest.OverlayCTA);
        result.OverlayImage.Should().Be(notificationTest.OverlayImage?.Src);

        result.PreAcceptanceHeaderTitle.Should().Be(notificationTest.PreAcceptanceHeaderTitle);
        result.PreAcceptanceImage.Should().Be(notificationTest.PreAcceptanceImage?.Src);
        result.PreAcceptanceDescription.Should().Be(notificationTest.PreAcceptanceDescription);
        result.PreAcceptanceKeyTerms.Should().Be(notificationTest.PreAcceptanceKeyTerms);
        result.PreAcceptanceTitle.Should().Be(notificationTest.PreAcceptanceTitle);
        result.PostAcceptanceHeaderTitle.Should().Be(notificationTest.PostAcceptanceHeaderTitle);
        result.PostAcceptanceTitle.Should().Be(notificationTest.PostAcceptanceTitle);
        result.PostAcceptanceImage.Should().Be(notificationTest.PostAcceptanceImage?.Src);
        result.PostAcceptanceDescription.Should().Be(notificationTest.PostAcceptanceDescription);
        result.OverlayManualTermsAndConditions.Should().Be(notificationTest.OverlayManualTermsAndConditions);
        result.ShowManualTermsAndConditionsOnOverlay.Should().Be(notificationTest.ShowManualTermsAndConditionsOnOverlay);
        result.UseRewardsOverlay.Should().Be(notificationTest.UseRewardsOverlay);
    }

    private static IDocumentMetadata SetupMetaDataMock(string src)
    {
        var mock = new Mock<IDocumentMetadata>();
        mock.Setup(o => o.Id).Returns(src);

        return mock.Object;
    }
}
