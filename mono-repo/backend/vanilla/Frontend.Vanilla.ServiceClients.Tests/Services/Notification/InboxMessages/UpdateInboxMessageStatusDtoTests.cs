using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public sealed class UpdateInboxMessageStatusDtoTests
{
    [Fact]
    public void CanBeSerialized()
    {
        var json = PosApiSerializationTester.Serialize(new UpdateInboxMessageStatusDto
        {
            MessageIds = new List<string> { "msg1", "msg2" },
            NewStatus = "Read",
        });

        json.Should().BeJson(@"{
                newStatus: 'Read',
                messageIds: [ 'msg1', 'msg2' ]
            }");
    }
}
