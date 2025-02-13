using System;
using System.Collections.Concurrent;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.LabelResolution;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class CurrentLabelTenantResolverTests
{
    private ICurrentTenantResolver target;
    private Mock<ICurrentContextAccessor> currentContextAccessor;
    private Mock<ILabelResolver> labelResolutionService;

    public CurrentLabelTenantResolverTests()
    {
        currentContextAccessor = new Mock<ICurrentContextAccessor>();
        labelResolutionService = new Mock<ILabelResolver>();
        target = new CurrentLabelTenantResolver(currentContextAccessor.Object, labelResolutionService.Object);
        currentContextAccessor.SetupGet(a => a.Items).Returns(new ConcurrentDictionary<object, Lazy<object>>());
    }

    [Fact]
    internal void Resolve_ShouldWork()
    {
        labelResolutionService.Setup(e => e.Get()).Returns("label.com");
        labelResolutionService.Setup(e => e.Get(LabelResolutionMode.HostnameEnd)).Returns("domain.com");

        var label = target.ResolveName();
        label.Should().Be("label.com");
        var domain = target.ResolveDomain();
        domain.Should().Be("domain.com");
    }
}
