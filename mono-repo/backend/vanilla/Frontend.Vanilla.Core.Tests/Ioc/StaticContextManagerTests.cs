using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Ioc;

public class StaticContextManagerTests
{
    private StaticContextManager target;
    private Mock<ICurrentContextSwitchHandler> switchHandler1;
    private Mock<ICurrentContextSwitchHandler> switchHandler2;
    private StaticContextAccessor currentContextAccessor;

    public StaticContextManagerTests()
    {
        switchHandler1 = new Mock<ICurrentContextSwitchHandler>();
        switchHandler2 = new Mock<ICurrentContextSwitchHandler>();
        currentContextAccessor = new StaticContextAccessor();
        target = new StaticContextManager(new[] { switchHandler1.Object, switchHandler2.Object }, currentContextAccessor);
    }

    [Fact]
    public void CurrentItems_ShouldReturnSingletonDictionary()
    {
        currentContextAccessor.Items.Should().NotBeNull().And.BeSameAs(currentContextAccessor.Items);
    }

    [Fact]
    public async Task SwitchContextAsync_ShouldCallHandlersAndRecreateItems()
    {
        var itemsBefore = currentContextAccessor.Items;
        var ct = TestCancellationToken.Get();

        IDictionary<object, Lazy<object>> itemsOnEnd = null, itemsOnBegin = null;
        switchHandler1.Setup(h => h.OnContextEndAsync(ct)).Callback(() => itemsOnEnd = currentContextAccessor.Items).Returns(Task.CompletedTask).Verifiable();
        switchHandler1.Setup(h => h.OnContextBeginAsync(ct)).Callback(() => itemsOnBegin = currentContextAccessor.Items).Returns(Task.CompletedTask).Verifiable();
        switchHandler2.Setup(h => h.OnContextEndAsync(ct)).Returns(Task.CompletedTask).Verifiable();
        switchHandler2.Setup(h => h.OnContextBeginAsync(ct)).Returns(Task.CompletedTask).Verifiable();

        await target.SwitchContextAsync(ct); // act

        CurrentItems_ShouldReturnSingletonDictionary();
        currentContextAccessor.Items.Should().NotBeSameAs(itemsBefore);
        itemsOnEnd.Should().BeSameAs(itemsBefore);
        itemsOnBegin.Should().BeSameAs(currentContextAccessor.Items);
        switchHandler1.Verify();
        switchHandler2.Verify();
    }

    [Fact]
    public void Constructor_ShouldThrow_IfContextResolverIsNotStatic()
        => new Action(() => new StaticContextManager(new[] { switchHandler1.Object, switchHandler2.Object }, Mock.Of<ICurrentContextAccessor>())).Should().Throw();
}
