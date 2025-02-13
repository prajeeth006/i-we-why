using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Concurrent;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core;

public sealed class WebContextResolverTests
{
    private ICurrentContextAccessor target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<IServiceProvider> serviceProviderMock;
    private Mock<IRequestScopedValuesProvider> requestScopedValuesProvider;
    private readonly TestLogger<WebContextAccessor> log;

    public WebContextResolverTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        log = new TestLogger<WebContextAccessor>();
        target = new WebContextAccessor(httpContextAccessor.Object, log);
        requestScopedValuesProvider = new Mock<IRequestScopedValuesProvider>();
        serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(_ => _.GetService(typeof(IRequestScopedValuesProvider))).Returns(requestScopedValuesProvider.Object);
    }

    [Fact]
    public void CurrentItems_ShouldDelegate_IfHttpContextAvailable()
    {
        httpContextAccessor.SetupGet(c => c.HttpContext.RequestServices).Returns(serviceProviderMock.Object);
        var items = new ConcurrentDictionary<object, Lazy<object>>() { ["item"] = new Lazy<object>("value") };
        requestScopedValuesProvider.SetupGet(x => x.Items).Returns(items);
        requestScopedValuesProvider.Setup(x => x.GetOrAddValue(It.IsAny<It.IsAnyType>(), It.IsAny<Func<It.IsAnyType, ConcurrentDictionary<object, Lazy<object>>>>())).Returns(items);

        // Act
        target.Items.Should().BeEquivalentTo(items);
    }

    [Fact]
    public void CurrentItems_ShouldReturnNewEmpty_IfNotHttpContext()
        => target.Items.Should().BeEmpty()
            .And.BeSameAs(target.Items, "should be singleton");
}
