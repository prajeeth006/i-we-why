using Frontend.SharedFeatures.Api.Features.ProductSwitchCoolOff;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ProductSwitchCoolOff;

public class ProductSwitchCoolOffControllerTests
{
    private readonly TestLogger<ProductSwitchCoolOffController> log = new ();

    [Fact]
    public async Task SetPlayerAreaTests()
    {
        var request = new SetPlayerAreaRequest();
        var service = new Mock<IPosApiResponsibleGamingServiceInternal>();
        var clock = new TestClock();
        var provider = new Mock<IServiceProvider>();
        provider.Setup(p => p.GetService(typeof(IPosApiResponsibleGamingServiceInternal))).Returns(service.Object);
        var controller = new ProductSwitchCoolOffController(provider.Object, clock, log);
        await controller.SetPlayerArea(request, CancellationToken.None);
        service.Verify(s => s.SetPlayerAreaAsync(request, It.IsAny<ExecutionMode>()), Times.Once);
    }
}
