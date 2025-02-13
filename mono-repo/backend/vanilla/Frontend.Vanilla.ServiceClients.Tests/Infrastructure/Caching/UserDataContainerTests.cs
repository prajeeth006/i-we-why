using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class UserDataContainerTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var items = new Dictionary<string, UserDataItem>();

        var target = new UserDataContainer(items); // Act

        target.Items.Should().BeSameAs(items);
        target.IsModified.Should().BeFalse();
        target.IsDisposed.Should().BeFalse();
    }

    [Fact]
    public void ShouldDisposeCorrectly()
    {
        var target = new UserDataContainer(new Dictionary<string, UserDataItem>());

        target.Dispose(); // Act

        target.IsDisposed.Should().BeTrue();
        target.Invoking(t => t.Dispose()).Should().Throw<ObjectDisposedException>();
    }

    [Fact]
    public void Item_ShouldCreateCorrectly()
    {
        var json = new JValue(123);
        var expires = new UtcDateTime(2001, 2, 3, 4, 5, 6);

        var target = new UserDataItem(json, expires); // Act

        target.Json.Should().BeSameAs(json);
        target.Expires.Should().Be(expires);
    }
}
