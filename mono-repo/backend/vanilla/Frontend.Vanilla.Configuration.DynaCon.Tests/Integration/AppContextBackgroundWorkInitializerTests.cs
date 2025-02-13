using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Integration;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Time.Background;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Integration;

public class AppContextBackgroundWorkInitializerTests
{
    private IBackgroundWorkInitializer target;
    private Mock<ICurrentContextAccessor> currentContextAccessor;
    private Mock<ICurrentChangesetResolver> currentChangesetResolver;

    public AppContextBackgroundWorkInitializerTests()
    {
        currentContextAccessor = new Mock<ICurrentContextAccessor>();
        currentChangesetResolver = new Mock<ICurrentChangesetResolver>();
        target = new AppContextBackgroundWorkInitializer(currentContextAccessor.Object, currentChangesetResolver.Object);
    }

    [Fact]
    public void ShouldCopyContextItems()
    {
        var executed = new List<string>();
        currentChangesetResolver.Setup(r => r.Resolve()).Callback(() => executed.Add("ConfigEnsure"));
        currentContextAccessor.SetupGet(a => a.Items).Callback(() => executed.Add("ContextItems")).Returns(new ConcurrentDictionary<object, Lazy<object>>
        {
            ["k1"] = new Lazy<object>("v1"),
            ["k2"] = new Lazy<object>("v2"),
        });

        // Act 1
        var func = target.CaptureParentContext();

        executed.Should().Equal("ConfigEnsure", "ContextItems");
        var backItems = new ConcurrentDictionary<object, Lazy<object>>();
        currentContextAccessor.SetupGet(a => a.Items).Returns(backItems);

        // Act 2
        func();

        backItems.Should().BeEquivalentTo(new ConcurrentDictionary<object, object> { ["k1"] = new Lazy<object>("v1"), ["k2"] = new Lazy<object>("v2") });
    }
}
