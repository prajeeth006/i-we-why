using System;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class DeviceFingerprintEnricherTests
{
    private readonly DeviceFingerprintEnricher target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;
    private readonly Mock<IDeviceDslProvider> deviceDslProviderMock;
    private readonly Mock<IBrowserDslProvider> browserDslProviderMock;
    private readonly Mock<IClientIPResolver> clientIpResolver;
    private HttpContext context;
    private readonly ExecutionMode mode = ExecutionMode.Async(TestCancellationToken.Get());
    private DeviceFingerprint fingerprint = new ();

    public DeviceFingerprintEnricherTests()
    {
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        deviceDslProviderMock = new Mock<IDeviceDslProvider>();
        browserDslProviderMock = new Mock<IBrowserDslProvider>();
        clientIpResolver = new Mock<IClientIPResolver>();
        context = new DefaultHttpContext();

        target = new DeviceFingerprintEnricher(
            httpContextAccessorMock.Object,
            deviceDslProviderMock.Object,
            browserDslProviderMock.Object,
            clientIpResolver.Object);

        context.Connection.RemoteIpAddress = IPAddress.Parse("127.0.0.1");
        context.Request.Headers[HttpHeaders.Accept] = "application/json";
        context.Request.Headers[HttpHeaders.AcceptLanguage] = "en-US";
        context.Request.Headers[HttpHeaders.AcceptEncoding] = "gzip";
        context.Request.Headers[HttpHeaders.AcceptCharset] = "utf-8";
        context.Request.Headers[HttpHeaders.Via] = "proxy";
        context.Request.Headers["X_FORWARDED_FOR"] = "192.168.1.1";
        httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);
    }

    [Fact]
    public async Task EnrichAsync_ShouldPopulateDeviceDetails()
    {
        clientIpResolver.Setup(c => c.Resolve()).Returns(IPAddress.Parse("192.168.1.1"));
        browserDslProviderMock.Setup(x => x.GetNameAsync(It.IsAny<ExecutionMode>())).ReturnsAsync("Chrome");
        browserDslProviderMock.Setup(x => x.GetMajorVersionAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(96);
        deviceDslProviderMock.Setup(x => x.OSNameAsync(It.IsAny<ExecutionMode>())).ReturnsAsync("Windows");
        deviceDslProviderMock.Setup(x => x.OSVersionAsync(It.IsAny<ExecutionMode>())).ReturnsAsync("10");
        deviceDslProviderMock.Setup(x => x.GetCapabilityAsync(It.IsAny<ExecutionMode>(), "id")).ReturnsAsync("58965");

        await target.EnrichAsync(fingerprint, mode);

        fingerprint.DeviceDetails["ip"].Should().Be("192.168.1.1");
        fingerprint.DeviceDetails["ac"].Should().Be("application/json");
        fingerprint.DeviceDetails["acl"].Should().Be("en-US");
        fingerprint.DeviceDetails["ace"].Should().Be("gzip");
        fingerprint.DeviceDetails["acc"].Should().Be("utf-8");
        fingerprint.DeviceDetails["via"].Should().Be("proxy");
        fingerprint.DeviceDetails["xff"].Should().Be("192.168.1.1");
        fingerprint.DeviceDetails["mac"].Should().BeEmpty();
        fingerprint.DeviceDetails["bnv"].Should().Be("Chrome 96");
        fingerprint.DeviceDetails["os"].Should().Be("Windows");
        fingerprint.DeviceDetails["osv"].Should().Be("10");
        fingerprint.DeviceDetails["uid"].Should().Be("58965");
    }

    [Fact]
    public async Task EnrichAsync_ShouldFallbackToPlatformNameAndVersion_WhenOSNameIsNull()
    {
        context.Request.Headers["User-Agent"] = "Android 10";

        await target.EnrichAsync(fingerprint, mode);

        fingerprint.DeviceDetails["os"].Should().Be("Android");
        fingerprint.DeviceDetails["osv"].Should().Be("10");
    }

    [Fact]
    public async Task EnrichAsync_ShouldReturnEmptyString_WhenValueIsNull()
    {
        browserDslProviderMock.Setup(x => x.GetMajorVersionAsync(It.IsAny<ExecutionMode>())).ThrowsAsync(new Exception());

        await target.EnrichAsync(fingerprint, mode);

        fingerprint.DeviceDetails["bnv"].Should().BeEmpty();
        fingerprint.DeviceDetails["uid"].Should().BeEmpty();
        fingerprint.DeviceDetails["osv"].Should().BeEmpty();
        fingerprint.DeviceDetails["os"].Should().BeEmpty();
        fingerprint.DeviceDetails["ip"].Should().Be("127.0.0.1");
    }
}
