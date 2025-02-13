#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.TermsAndConditions;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Inbox;

internal class InboxOfferTest : IInboxOffer
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

internal class TestInboxContentProvider(IInboxOffer inboxOffer) : IInboxContentProvider
{
    public string MessageSource => "TestInboxContentProvider";

    public string StaticContentPath { get; }

    public InboxMessageContent GetContent(string itemId, IReadOnlyDictionary<string, string> templateMetaData)
    {
        return new InboxMessageContent
        {
            DetailTitle = Format(templateMetaData, inboxOffer.DetailTitle),
            DetailImage = new InboxDetailImage(inboxOffer.DetailImage?.Src, inboxOffer.ImageLink),
            DetailDescription = Format(templateMetaData, inboxOffer.DetailDescription),
            DetailCallToAction = inboxOffer.DetailCallToAction,
            ShortImage = inboxOffer.ShortImage?.Src,
            SnippetTitle = Format(templateMetaData, inboxOffer.SnippetTitle),
            SnippetDescription = Format(templateMetaData, inboxOffer.SnippetDescription),
            SnippetCallToAction = inboxOffer.SnippetCallToAction,
        };
    }

    public string ResolveMessage(Dictionary<string, string> replacableKeysDictionary, string msgItem)
    {
        return replacableKeysDictionary[msgItem];
    }

    private static string Format(IReadOnlyDictionary<string, string> templateMetaData, string data)
    {
        var result = data;

        if (templateMetaData != null && !string.IsNullOrEmpty(result))
        {
            foreach (var pair in templateMetaData)
            {
                result = result.Replace(pair.Key, pair.Value + $"[{nameof(TestInboxContentProvider)}]");
            }
        }

        return result;
    }
}

public class InboxMessagesClientValuesProviderTests
{
    private readonly InboxMessagesClientValuesProvider service;

    private readonly Mock<IContentService> contentServiceMock;
    private readonly Mock<IEnvironmentProvider> environmentProviderMock;
    private readonly Mock<ITermsAndConditionsContentProvider> termsAndConditionsContentProvider;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;
    private readonly TestInboxContentProvider testInboxContentProvider;

    private readonly InboxOfferTest inboxOfferTest;
    private readonly List<InboxMessage> testInboxMessages;
    private readonly KeyValuePair<string, string> testKeyValue;
    private readonly KeyValuePair<string, string> testKeyValue2;

    public InboxMessagesClientValuesProviderTests()
    {
        contentServiceMock = new Mock<IContentService>();
        environmentProviderMock = new Mock<IEnvironmentProvider>();
        environmentProviderMock.Setup(e => e.CurrentLabel).Returns(".bwin.com");

        termsAndConditionsContentProvider = new Mock<ITermsAndConditionsContentProvider>();

        testKeyValue = new KeyValuePair<string, string>("*MyTestKey*", "[MyKeyValue]");
        testKeyValue2 = new KeyValuePair<string, string>("#INBOX_MESSAGE_CREATED_DATE#", "31/03/2019 11:59 PM_CET");
        inboxOfferTest = new InboxOfferTest()
        {
            DetailTitle = $"DetailTitle {testKeyValue.Key}",
            DetailDescription = $"DetailDescription {testKeyValue.Key}",
            SnippetTitle = $"SnippetTitle {testKeyValue.Key}",
            SnippetDescription = $"SnippetDescription {testKeyValue.Key}",

            DetailImage = new ContentImage("Src1", null, null, null),
            ImageLink = new ContentLink(new Uri("http://bwin.com/en/test/"),
                "imageText",
                new ContentParameters(new[] { new KeyValuePair<string, string>("attr", "newAttribute") })),
            DetailCallToAction = "DetailCallToAction",
            ShortImage = new ContentImage("Src2", null, null, null),
            SnippetCallToAction = "SnippetCallToAction",
        };

        testInboxContentProvider = new TestInboxContentProvider(inboxOfferTest);
        testInboxMessages = new List<InboxMessage>
        {
            new (sourceStatus: "OFFER_NEW", messageType: "BONUS_OFFER",
                messageSource: testInboxContentProvider.MessageSource, templateId: "541568dfas25",
                templateMetaData: new List<KeyValuePair<string, string>> { testKeyValue, testKeyValue2 }),
        };

        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();

        service = new InboxMessagesClientValuesProvider(
            new List<IInboxContentProvider> { testInboxContentProvider },
            contentServiceMock.Object,
            environmentProviderMock.Object,
            termsAndConditionsContentProvider.Object,
            new TestLogger<InboxMessagesClientValuesProvider>(),
            dateTimeCultureBasedFormatter.Object);
    }

    [Fact]
    public void IsPersonalDetailsAddressEditableBwinGr_IsAgeIdVerified_IsAddressVerified_ReturnsFalse()
    {
        var templateMock = new Mock<IViewTemplate>();
        templateMock.Setup(o => o.Title).Returns("SampleTitle");
        templateMock.Setup(o => o.Text)
            .Returns("Your requested new limits will be available after a waiting period of {0}");
        templateMock.Setup(o => o.Messages)
            .Returns(new Dictionary<string, string> { { "VERIFIED", "Test verified" } }.AsContentParameters());
        templateMock.SetupGet(o => o.Metadata.Id).Returns("MetaData");
        contentServiceMock.Setup(x =>
                x.Get<IViewTemplate>("MobileLogin-v1.0/Rtms/CasinoCategoryIconMappings",
                    It.IsAny<ContentLoadOptions>()))
            .Returns(templateMock.Object);

        var result = service.GetMessages(testInboxMessages);

        foreach (var ms in result)
        {
            ms.Content.DetailTitle.Should().Be(inboxOfferTest.DetailTitle?.Replace(testKeyValue.Key,
                testKeyValue.Value + $"[{nameof(TestInboxContentProvider)}]"));
            ms.Content.DetailDescription.Should().Be(inboxOfferTest.DetailDescription?.Replace(testKeyValue.Key,
                testKeyValue.Value + $"[{nameof(TestInboxContentProvider)}]"));
            ms.Content.SnippetTitle.Should().Be(inboxOfferTest.SnippetTitle?.Replace(testKeyValue.Key,
                testKeyValue.Value + $"[{nameof(TestInboxContentProvider)}]"));
            ms.Content.SnippetDescription.Should().Be(inboxOfferTest.SnippetDescription?.Replace(testKeyValue.Key,
                testKeyValue.Value + $"[{nameof(TestInboxContentProvider)}]"));

            ms.Content.DetailImage.DetailImage.Should().Be(inboxOfferTest.DetailImage?.Src);
            ms.Content.DetailImage.DetailImageLink.Should().Be(inboxOfferTest.ImageLink?.Url.ToString());
            ms.Content.DetailCallToAction.Should().Be(inboxOfferTest.DetailCallToAction);
            ms.Content.ShortImage.Should().Be(inboxOfferTest.ShortImage?.Src);
            ms.Content.SnippetCallToAction.Should().Be(inboxOfferTest.SnippetCallToAction);

            ms.MessageSource.Should().NotBeNull();
            ms.SourceStatus.Should().NotBeNull();
            ms.MessageType.Should().NotBeNull();

            ms.CreatedDate.Should().Be(testKeyValue2.Value);

            if (ms.MobileGameList != null)
            {
                foreach (var game in ms.MobileGameList)
                {
                    game.InternalGameName.Should().NotBeNull();
                    game.Title.Should().NotBeNull();
                }
            }
        }
    }

    [Fact]
    public void InboxMessagesClientValuesProvider_ParseGamesString_Error()
    {
        environmentProviderMock.Setup(e => e.CurrentLabel).Throws(new Exception());
        var templateMock = new Mock<IViewTemplate>();
        templateMock.Setup(o => o.Title).Returns("SampleTitle");
        templateMock.Setup(o => o.Text)
            .Returns("Your requested new limits will be available after a waiting period of {0}");
        templateMock.Setup(o => o.Messages)
            .Returns(new Dictionary<string, string> { { "VERIFIED", "Test verified" } }.AsContentParameters());
        templateMock.SetupGet(o => o.Metadata.Id).Returns("MetaData");
        contentServiceMock.Setup(x =>
                x.Get<IViewTemplate>("MobileLogin-v1.0/Rtms/CasinoCategoryIconMappings",
                    It.IsAny<ContentLoadOptions>()))
            .Returns(templateMock.Object);

        var result = service.GetMessages(testInboxMessages).ToList();

        for (var i = 0; i < result.Count; i++)
        {
            var ms = result[i];

            if (testInboxMessages[i].TemplateMetaData.ContainsKey("#APPLICABLE_MOBILE_GAMES#"))
            {
                ms.MobileGameList.Should().NotBeNull();
            }
            else
            {
                ms.MobileGameList.Should().BeNull();
            }
        }
    }

    [Fact]
    public void InboxMessagesClientValuesProvider_ParseGamesString()
    {
        const string casinoHomeLink = "https://casino.m.bwin.com/en/casino";
        var linkTemplateMock = new Mock<ILinkTemplate>();
        linkTemplateMock.Setup(x => x.Url).Returns(new Uri(casinoHomeLink, UriKind.RelativeOrAbsolute));
        contentServiceMock
            .Setup(x =>
                x.Get<ILinkTemplate>("App-v1.0/Links/HomeCasino", It.IsAny<ContentLoadOptions>()))
            .Returns(linkTemplateMock.Object);

        var templateMock = new Mock<IViewTemplate>();
        templateMock.Setup(o => o.Title).Returns("SampleTitle");
        templateMock.Setup(o => o.Text)
            .Returns("Your requested new limits will be available after a waiting period of {0}");
        templateMock.Setup(o => o.Messages)
            .Returns(new Dictionary<string, string> { { "VERIFIED", "Test verified" } }.AsContentParameters());
        templateMock.SetupGet(o => o.Metadata.Id).Returns("MetaData");
        contentServiceMock.Setup(x =>
                x.Get<IViewTemplate>("MobileLogin-v1.0/Rtms/CasinoCategoryIconMappings",
                    It.IsAny<ContentLoadOptions>()))
            .Returns(templateMock.Object);

        // _contentServiceMock.Setup(x =>x.Get<IViewTemplate>(LabelHostPlugin.ContentRoot + "/Rtms/CasinoCategoryIconMappings",It.IsAny<ContentLoadOptions>()));
        foreach (var testInboxMessage in testInboxMessages)
        {
            var result = service.GetMessages(new[] { testInboxMessage }).ToList();
            result.Count.Should().Be(1);
            result[0].CasinoHomeLink.Should().Be(casinoHomeLink);
        }
    }
}
