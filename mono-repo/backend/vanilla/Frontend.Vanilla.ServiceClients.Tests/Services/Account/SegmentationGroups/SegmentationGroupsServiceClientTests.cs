using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.SegmentationGroups;

public sealed class SegmentationGroupsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new SegmentationGroupsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.UserSegmentationGroups);
        target.CacheKey.Should().Be("SegmentationGroups"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
