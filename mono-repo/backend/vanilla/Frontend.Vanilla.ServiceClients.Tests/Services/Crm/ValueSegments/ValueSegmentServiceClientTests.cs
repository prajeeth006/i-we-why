using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.ValueSegments;

public sealed class ValueSegmentServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new ValueSegmentServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.LoyaltyValueSegment);
        target.CacheKey.Should().Be("ValueSegment"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
