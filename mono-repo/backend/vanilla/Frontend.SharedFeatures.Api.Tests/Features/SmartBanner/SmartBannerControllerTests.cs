using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SmartBanner;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SmartBanner;

public class SmartBannerControllerTests
{
    private readonly SmartBannerController target;
    private readonly Mock<IPosApiCommonServiceInternal> posApiCommonService;
    private readonly Mock<IGeoIPDslProvider> geoIPDslProvider;
    private readonly Mock<IDeviceDslProvider> deviceDslProvider;
    private readonly TestLogger<SmartBannerController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public SmartBannerControllerTests()
    {
        posApiCommonService = new Mock<IPosApiCommonServiceInternal>();
        geoIPDslProvider = new Mock<IGeoIPDslProvider>();
        deviceDslProvider = new Mock<IDeviceDslProvider>();
        log = new TestLogger<SmartBannerController>();
        target = new SmartBannerController(posApiCommonService.Object, geoIPDslProvider.Object, deviceDslProvider.Object, log);
        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);

        deviceDslProvider.Setup(p => p.OSNameAsync(mode)).ReturnsAsync("xOS");
        geoIPDslProvider.Setup(c => c.GetCountry()).Returns("DE");
    }

    [Fact]
    public async Task ShouldGetApplicationInfo()
    {
        var applicationStoreInfo = new ApplicationInformation("test", 5.36M);
        posApiCommonService.Setup(c => c.GetApplicationInformationAsync(ct, "xOS", "5568", "DE")).ReturnsAsync(applicationStoreInfo);

        dynamic result = await target.Get("5568", ct); // Act

        ((object)result.Value).Should().BeEquivalentTo(new { Name = "test", Rating = 5.36M });

        posApiCommonService.Verify(s => s.GetApplicationInformationAsync(ct, "xOS", "5568", "DE"));
    }

    [Fact]
    public async Task ShouldReturnServerError_IfException()
    {
        var ex = new Exception("Content error.");
        posApiCommonService.Setup(s => s.GetApplicationInformationAsync(ct, It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(ex);

        var result = (StatusCodeResult)await target.Get("test", ct); // Act

        result.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }
}
