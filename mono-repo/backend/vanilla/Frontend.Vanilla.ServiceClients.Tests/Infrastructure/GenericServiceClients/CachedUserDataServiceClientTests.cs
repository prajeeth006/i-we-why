using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.GenericServiceClients;

public class CachedUserDataServiceClientTests
{
    private CachedUserDataServiceClient<FooDto, Foo> target;
    private Mock<IGetDataServiceClient> getDataServiceClient;
    private PathRelativeUri testUrl;

    public CachedUserDataServiceClientTests()
    {
        getDataServiceClient = new Mock<IGetDataServiceClient>();
        testUrl = new PathRelativeUri("test");
        target = new TestServiceClient(getDataServiceClient.Object, testUrl, "CacheKey");
    }

    internal class TestServiceClient : CachedUserDataServiceClient<FooDto, Foo>
    {
        public TestServiceClient(IGetDataServiceClient getDataServiceClient, PathRelativeUri dataUrl, RequiredString cacheKey)
            : base(getDataServiceClient, dataUrl, cacheKey) { }
    }

    public class Foo { }

    public class FooDto : IPosApiResponse<Foo>
    {
        public virtual Foo GetData() => null;
    }

    [Fact]
    public void ShouldExposeParameters()
    {
        target.DataUrl.Should().BeSameAs(testUrl);
        target.CacheKey.Should().Be("CacheKey");
    }

    [Theory]
    [InlineData(null, true)]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public void GetAsync_ShouldDelegateWithSpecifiedUrl(bool? cached, bool expectedCached)
    {
        var mode = TestExecutionMode.Get();
        var fooTask = Task.FromResult(Mock.Of<Foo>());
        getDataServiceClient.SetupWithAnyArgs(c => c.GetAsync<FooDto, Foo>(default, default, null, default, null, null)).Returns(fooTask);

        // Act
        var task = cached != null
            ? target.GetAsync(mode, cached.Value)
            : target.GetCachedAsync(mode);

        task.Should().BeSameAs(fooTask);
        getDataServiceClient.Verify(c => c.GetAsync<FooDto, Foo>(mode, PosApiDataType.User, testUrl, expectedCached, "CacheKey", null));
    }

    [Fact]
    public void InvalidateCached_ShouldDelegateWithSpecifiedUrl()
    {
        target.InvalidateCached(); // Act

        getDataServiceClient.Verify(c => c.InvalidateCached(PosApiDataType.User, "CacheKey"));
    }

    [Fact]
    public void SetToCache_ShouldDelegateWithSpecifiedUrl()
    {
        var foo = Mock.Of<Foo>();

        target.SetToCache(foo); // Act

        getDataServiceClient.Verify(c => c.SetToCache(PosApiDataType.User, "CacheKey", foo));
    }

    [Fact]
    public void CacheKey_ShouldBeCalculatedFromEntityName()
    {
        target = new TestServiceClient(getDataServiceClient.Object, testUrl, cacheKey: null);
        target.CacheKey.Should().Be("Foo");
    }

    internal interface IInvalidDto : IPosApiResponse<Foo> { }

    public interface IInvalid { }

    public class InvalidDto : IPosApiResponse<IInvalid>
    {
        public IInvalid GetData() => null;
    }

    internal class InvalidServiceClient<TDto, TData> : CachedUserDataServiceClient<TDto, TData>
        where TDto : class, IPosApiResponse<TData>
    {
        public InvalidServiceClient()
            : base(null, null) { }
    }

    [Theory]
    [InlineData(typeof(InvalidServiceClient<IInvalidDto, Foo>), "TDto")]
    [InlineData(typeof(InvalidServiceClient<InvalidDto, IInvalid>), "TData")]
    public void ShouldThrow_IfDtoOrDataIsNotFinalClass(Type serviceClientType, string expectedPrefix)
        => new Action(() => Activator.CreateInstance(serviceClientType))
            .Should().Throw().Which.InnerException.InnerException.Message.Should().StartWith(expectedPrefix + " must be a final class");
}
