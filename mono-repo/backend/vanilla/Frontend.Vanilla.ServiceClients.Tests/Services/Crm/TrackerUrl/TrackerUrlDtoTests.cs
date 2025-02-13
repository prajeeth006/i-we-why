using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.TrackerUrl;

public class TrackerUrlDtoTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""url"":""http://bwin.com/tracker.jpg""
            }";

        // Act
        var target = PosApiSerializationTester.Deserialize<TrackerUrlDto>(json);

        target.Url.Should().Be("http://bwin.com/tracker.jpg");
    }
}
