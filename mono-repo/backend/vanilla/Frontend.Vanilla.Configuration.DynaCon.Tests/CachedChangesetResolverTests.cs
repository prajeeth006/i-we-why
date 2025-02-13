using System;
using System.Collections.Concurrent;
using FluentAssertions;
using Frontend.Vanilla.Core.Ioc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public class CachedChangesetResolverTests
{
    private ICurrentChangesetResolver target;
    private Mock<ICurrentChangesetResolver> inner;

    public CachedChangesetResolverTests()
    {
        var currentContextAccessor = Mock.Of<ICurrentContextAccessor>(a => a.Items == new ConcurrentDictionary<object, Lazy<object>>());
        inner = new Mock<ICurrentChangesetResolver>();
        target = new CachedChangesetResolver(inner.Object, currentContextAccessor);
    }

    [Fact]
    public void ShouldCacheReturnedChangeset()
    {
        var innerChangeset = Mock.Of<IValidChangeset>();
        inner.Setup(i => i.Resolve()).Returns(innerChangeset);

        for (var i = 0; i < 10; i++)
            target.Resolve().Should().BeSameAs(innerChangeset); // Act
    }
}
