using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class PosApiDataCacheBaseTests
{
    private IPosApiDataCache target;
    private Mock<PosApiDataCacheBase> underlyingMock;

    private IFoo foo;
    private CancellationToken ct;
    private TimeSpan expiration;
    private Func<Task<IFoo>> receivedFactory;

    public PosApiDataCacheBaseTests()
    {
        underlyingMock = new Mock<PosApiDataCacheBase>();
        target = underlyingMock.Object;

        foo = Mock.Of<IFoo>();
        ct = TestCancellationToken.Get();
        expiration = TimeSpan.FromSeconds(666);
        receivedFactory = null;

        underlyingMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<IFoo>(default, default, null, null, default, null))
            .Callback((ExecutionMode m, PosApiDataType t, RequiredString k, Func<Task<IFoo>> f, bool c, TimeSpan? e) => receivedFactory = f)
            .ReturnsAsync(foo);
    }

    public interface IFoo { }

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(PosApiDataType.Static, PosApiDataType.User);

    [Theory, MemberData(nameof(TestCases))]
    public void Get_ShouldDelegate(bool isCacheHit, PosApiDataType dataType)
    {
        var innerResult = isCacheHit ? new Wrapper<IFoo>(foo) : null;
        underlyingMock.Setup(c => c.GetAsync<IFoo>(ExecutionMode.Sync, dataType, "key")).ReturnsAsync(innerResult);

        // Act
        var result = target.Get<IFoo>(dataType, "key");

        result.Should().BeSameAs(innerResult);
    }

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetAsync_ShouldDelegate(bool isCacheHit, PosApiDataType dataType)
    {
        var innerResult = isCacheHit ? new Wrapper<IFoo>(foo) : null;
        underlyingMock.Setup(c => c.GetAsync<IFoo>(ExecutionMode.Async(ct), dataType, "key")).ReturnsAsync(innerResult);

        // Act
        var result = await target.GetAsync<IFoo>(dataType, "key", ct);

        result.Should().BeSameAs(innerResult);
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public void Set_ShouldDelegate(PosApiDataType dataType)
    {
        target.Set(dataType, "key", foo, expiration); // Act

        underlyingMock.Verify(c => c.SetAsync(ExecutionMode.Sync, dataType, "key", foo, expiration));
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task SetAsync_ShouldDelegate(PosApiDataType dataType)
    {
        await target.SetAsync(dataType, "key", foo, ct, expiration); // Act

        underlyingMock.Verify(c => c.SetAsync(ExecutionMode.Async(ct), dataType, "key", foo, expiration));
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public void Remove_ShouldDelegate(PosApiDataType dataType)
    {
        target.Remove(dataType, "key"); // Act

        underlyingMock.Verify(c => c.RemoveAsync(ExecutionMode.Sync, dataType, "key"));
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task RemoveAsync_ShouldDelegate(PosApiDataType dataType)
    {
        await target.RemoveAsync(dataType, "key", ct); // Act

        underlyingMock.Verify(c => c.RemoveAsync(ExecutionMode.Async(ct), dataType, "key"));
    }

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetOrCreate_ShouldDelegate(bool cached, PosApiDataType dataType)
    {
        var factoryResult = Mock.Of<IFoo>();
        var factory = new Mock<Func<IFoo>>();
        factory.Setup(f => f()).Returns(factoryResult);

        var value = target.GetOrCreate(dataType, "key", factory.Object, cached, expiration); // Act

        value.Should().BeSameAs(foo);
        underlyingMock.Verify(c => c.GetOrCreateAsync(ExecutionMode.Sync, dataType, "key", It.IsNotNull<Func<Task<IFoo>>>(), cached, expiration));
        factory.Verify(f => f(), Times.Never);
        (await receivedFactory()).Should().BeSameAs(factoryResult);
    }

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetOrCreateAsync_ShouldDelegate(bool cached, PosApiDataType dataType)
    {
        var factory = Mock.Of<Func<Task<IFoo>>>();

        var value = await target.GetOrCreateAsync(dataType, "key", factory, ct, cached, expiration); // Act

        value.Should().BeSameAs(foo);
        underlyingMock.Verify(c => c.GetOrCreateAsync(ExecutionMode.Async(ct), dataType, "key", factory, cached, expiration));
    }
}
