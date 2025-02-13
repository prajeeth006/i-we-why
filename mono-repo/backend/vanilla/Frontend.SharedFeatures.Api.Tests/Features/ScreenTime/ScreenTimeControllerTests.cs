using Frontend.SharedFeatures.Api.Features.ScreenTime;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ScreenTime;

public class ScreenTimeControllerTests
{
    private readonly TestLogger<ScreenTimeController> log = new ();

    [Fact]
    public async Task SaveScreenTimeTests()
    {
        var request = new ScreenTimeSaveRequest();
        var service = new Mock<IPosApiResponsibleGamingServiceInternal>();
        var provider = new Mock<IServiceProvider>();
        provider.Setup(p => p.GetService(typeof(IPosApiResponsibleGamingServiceInternal))).Returns(service.Object);
        var controller = new ScreenTimeController(provider.Object, log);
        await controller.SaveScreenTimeAction(request, CancellationToken.None);
        service.Verify(s => s.SaveScreenTimeAsync(request, It.IsAny<ExecutionMode>()), Times.Once);
    }
}
