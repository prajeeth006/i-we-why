using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests;

public class HostPathDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;
    private readonly Mock<IHostPathResolver> hostPathResolver;
    private readonly Mock<ISingleDomainHostPathResolver> singleDomainHostPathResolver;
    private readonly Mock<ISingleDomainAppConfiguration> singleDomainAppConfiguration;
    private HttpContext context = new DefaultHttpContext();

    public HostPathDynaConProviderTests()
    {
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        hostPathResolver = new Mock<IHostPathResolver>();
        singleDomainAppConfiguration = new Mock<ISingleDomainAppConfiguration>();
        singleDomainHostPathResolver = new Mock<ISingleDomainHostPathResolver>();
        Target = new HostPathDynaConProvider(httpContextAccessorMock.Object, singleDomainAppConfiguration.Object, singleDomainHostPathResolver.Object, hostPathResolver.Object);

        httpContextAccessorMock.SetupGet(h => h.HttpContext).Returns(context);
    }

    [Theory]
    [InlineData(HostPath.Sports)]
    [InlineData(HostPath.Games)]
    internal void GetCurrentRawValue_ShouldMapCorrectly(HostPath expected)
    {
        hostPathResolver.Setup(p => p.Resolve()).Returns(expected.ToString());

        Target.GetCurrentRawValue().Should().Be(expected.ToString());
    }

    [Theory]
    [InlineData(HostPath.Sports)]
    [InlineData(HostPath.Games)]
    internal void GetCurrentRawValue_ShouldMapCorrectlyForSingleDomain(HostPath expected)
    {
        singleDomainAppConfiguration.Setup(x => x.IsEnabled()).Returns(true);
        singleDomainHostPathResolver.Setup(p => p.Resolve(context)).Returns(expected.ToString());

        Target.GetCurrentRawValue().Should().Be(expected.ToString());
    }
}
