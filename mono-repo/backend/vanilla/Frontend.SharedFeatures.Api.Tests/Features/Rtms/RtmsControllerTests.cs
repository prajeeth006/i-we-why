using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Rtms;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.RtmsLayer;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Rtms;

public class RtmsControllerTests
{
    private readonly RtmsController controller;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IRtmsMessagesClientValuesProvider> rtmsMessagesClientValuesProviderMock;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly IList<RtmsMessageRequest> listTemplates;

    public RtmsControllerTests()
    {
        contentService = new Mock<IContentService>();
        rtmsMessagesClientValuesProviderMock = new Mock<IRtmsMessagesClientValuesProvider>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();

        listTemplates = new List<RtmsMessageRequest>
        {
            new RtmsMessageRequest(
                "messageId",
                "/id/892b6553-6188-4955-8bef-f0b71619dde4",
                "type",
                "campaign",
                new Dictionary<string, string>
                {
                    { "#CASH_CURRENCY#", "EUR" },
                    { "#FORMAT_EMPTY_CASH_CURRENCY#", "EUR" },
                    { "#CASH_VALUE#", "14.25" },
                    { "#FORMAT_AMOUNT_CASH_VALUE#", "14.25_EUR" },
                    { "#FORMAT_CURRENCY_CASH_CURRENCY#", "EUR" },
                }, string.Empty),
        };

        controller = new RtmsController(
            rtmsMessagesClientValuesProviderMock.Object,
            clientContentServiceMock.Object,
            contentService.Object,
            new TestLogger<RtmsController>());
    }

    [Fact]
    public void Rtms_PostMessagesByTemplates_Success()
    {
        var overlayCallToAction = "<a href=\"http://rtmsoverlayaction\">Claim Now!</a>";
        var overlayDescription = "<p>CASH_CURRENCY : EUR</p><p>FORMAT_EMPTY_CASH_CURRENCY : EUR</p>" +
                                 "<p>FORMAT_AMOUNT_CASH_VALUE : 14.25_EUR</p><p>CASH_CURRENCY : EUR</p>";
        var overlayImage = "/Vanilla/sportingbet.com/Client/Preview5";
        var overlayTitle = "Title";
        var toasterTitle = "ToasterTitle";
        var toasterCallToAction = "<a href=\"http://rtmstoasteraction\">Claim Now!</a>";
        var toasterPrimaryGhostCallToAction = "<a href=\"http://primary\">More info</a>";
        var toasterSecondaryGhostCallToAction = "<a href=\"http://secondady\">Close</a>";
        var toasterDescription = "<p>CASH_CURRENCY : EUR</p><p>FORMAT_EMPTY_CASH_CURRENCY : EUR</p>" +
                                 "<p>FORMAT_AMOUNT_CASH_VALUE : 14.25_EUR</p><p>CASH_CURRENCY : EUR</p>";
        var tosterImage = "/Vanilla/partycasino.com/Casino/Homepage_banners/1162x278-CashGrabPC-EN-";

        rtmsMessagesClientValuesProviderMock.Setup(x => x.GetMessages(listTemplates, false))
            .Returns(new List<RtmsMessageViewModel>
            {
                new RtmsMessageViewModel
                {
                    Content = new NotificationMessageContent
                    {
                        OverlayCallToAction = overlayCallToAction,
                        OverlayDescription = overlayDescription,
                        OverlayImage = overlayImage,
                        OverlayTitle = overlayTitle,
                        ToasterTitle = toasterTitle,
                        ToasterCallToAction = toasterCallToAction,
                        ToasterPrimaryGhostCallToAction = toasterPrimaryGhostCallToAction,
                        ToasterCloseCallToActionLabel = toasterSecondaryGhostCallToAction,
                        ToasterDescription = toasterDescription,
                        TosterImage = tosterImage,
                    },
                },
            });

        var response = controller.PostMessages(listTemplates);

        var result = response.GetOriginalResult<OkObjectResult>();
        result.Should().NotBeNull();
        var r = (RtmsMessageResponse)result.Value!;
        var messages = r.Messages.ToList();
        messages.Count.Should().Be(1);
        var message = messages.First();
        message.Content.OverlayCallToAction.Should().Be(overlayCallToAction);
        message.Content.OverlayDescription.Should().Be(overlayDescription);
        message.Content.OverlayImage.Should().Be(overlayImage);
        message.Content.OverlayTitle.Should().Be(overlayTitle);
        message.Content.ToasterTitle.Should().Be(toasterTitle);
        message.Content.ToasterCallToAction.Should().Be(toasterCallToAction);
        message.Content.ToasterPrimaryGhostCallToAction.Should().Be(toasterPrimaryGhostCallToAction);
        message.Content.ToasterCloseCallToActionLabel.Should().Be(toasterSecondaryGhostCallToAction);
        message.Content.ToasterDescription.Should().Be(toasterDescription);
        message.Content.TosterImage.Should().Be(tosterImage);
    }

    [Fact]
    public void Rtms_PostMessagesByEmptyListTemplates_Exception()
    {
        rtmsMessagesClientValuesProviderMock
            .Setup(x => x.GetMessages(It.IsAny<IEnumerable<RtmsMessageRequest>>(), false))
            .Throws(new Exception());

        var response = controller.PostMessages(new List<RtmsMessageRequest>());

        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }
}
