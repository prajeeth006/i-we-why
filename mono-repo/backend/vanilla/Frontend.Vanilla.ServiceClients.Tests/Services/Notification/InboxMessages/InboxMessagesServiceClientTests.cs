using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public class InboxMessagesServiceClientTests : ServiceClientTestsBase
{
    private IInboxMessagesServiceClient target;
    private IReadOnlyList<InboxMessage> testMessages;

    protected override void Setup()
    {
        target = new InboxMessagesServiceClient(RestClient.Object);

        testMessages = new[] { new InboxMessage(), new InboxMessage() };
        RestClientResult = new InboxMessagesResponse { MessageDetails = testMessages.ToList() };
    }

    [Theory, BooleanData]
    public async Task ShouldCallUrl_WithoutFilter(bool emptyFilter)
    {
        var filter = emptyFilter ? new InboxMessageFilter() : null;

        var result = await target.GetAsync(TestMode, filter); // Act

        Verify(result, expectedUrl: "Notification.svc/inbox");
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly_WithFilter()
    {
        var filter = new InboxMessageFilter
        {
            Status = "xxx",
            MessageSource = "sss",
            StartDate = new UtcDateTime(2015, 01, 02),
            EndDate = new UtcDateTime(2016, 03, 04),
            PageSize = 12,
            PageIndex = 3,
        };

        var result = await target.GetAsync(TestMode, filter); // Act

        Verify(result, expectedUrl: "Notification.svc/inbox"
                                    + "?status=xxx"
                                    + "&messageSource=sss"
                                    + "&startDate=2015-01-02T00%3A00%3A00.0000000Z"
                                    + "&endDate=2016-03-04T00%3A00%3A00.0000000Z"
                                    + "&pageSize=12"
                                    + "&pageIndex=3");
    }

    private void Verify(IReadOnlyList<InboxMessage> result, string expectedUrl)
    {
        result.Should().Equal(testMessages);
        VerifyRestClient_ExecuteAsync(expectedUrl, authenticate: true, resultType: typeof(InboxMessagesResponse));
    }
}
