using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.MappedQuery;

public class MappedTrackerIdDtoTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly_FromTrackerId()
    {
        const string json = @"{ ""trackerId"": 42 }";

        var target = PosApiSerializationTester.Deserialize<MappedTrackerIdDto>(json); // Act

        target.TrackerId.Should().Be(42);
    }

    [Fact]
    public void ShouldBeDeserializedCorrectly_FromWmId()
    {
        const string json = @"{ ""wmid"": 42 }";

        var target = PosApiSerializationTester.Deserialize<MappedTrackerIdDto>(json); // Act

        target.TrackerId.Should().Be(42);
    }
}
