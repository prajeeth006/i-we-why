using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ValueSegment;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ValueSegment;

public class ValueSegmentClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternal;

    public ValueSegmentClientConfigProviderTests()
    {
        posApiCrmServiceInternal = new Mock<IPosApiCrmServiceInternal>();

        Target = new ValueSegmentClientConfigProvider(posApiCrmServiceInternal.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnValues()
    {
        posApiCrmServiceInternal.Setup(c => c.GetValueSegmentAsync(It.IsAny<CancellationToken>(), It.IsAny<bool>())).ReturnsAsync(new ServiceClients.Services.Crm.ValueSegments.ValueSegment(25, 35));

        var config = await Target_GetConfigAsync();

        config["customerId"].Should().Be(25);
        config["segmentId"].Should().Be(35);
    }
}
