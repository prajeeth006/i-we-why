using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.GenericServiceClients;

public sealed class GetDataServiceClientTests : ServiceClientTestsBase
{
    private IGetDataServiceClient target;
    private PathRelativeUri testUrl;

    protected override void Setup()
    {
        target = new GetDataServiceClient(RestClient.Object, Cache.Object);
        testUrl = new PathRelativeUri("test/url");
    }

    public class Foo { }

    [Theory]
    [InlineData(PosApiDataType.Static, false, false)]
    [InlineData(PosApiDataType.Static, false, true)]
    [InlineData(PosApiDataType.User, true, false)]
    [InlineData(PosApiDataType.User, true, true)]
    public async Task GetAsync_ShouldGetData(PosApiDataType dataType, bool expectedAuthenticate, bool cached)
    {
        var foo = new Foo();
        RestClientResult = Mock.Of<IPosApiResponse<Foo>>(r => r.GetData() == foo);

        // Act
        var result = await target.GetAsync<IPosApiResponse<Foo>, Foo>(TestMode, dataType, testUrl, cached, "CacheKey");

        result.Should().BeSameAs(foo);
        VerifyRestClient_ExecuteAsync(testUrl.ToString(), HttpMethod.Get, expectedAuthenticate, resultType: typeof(IPosApiResponse<Foo>));
        VerifyCache_GetOrCreateAsync<Foo>(dataType, "CacheKey", cached);
    }

    [Fact]
    public async Task GetAsync_ShouldUseUrlAsCacheKey_IfNoCacheKeyProvided()
    {
        RestClientResult = Mock.Of<IPosApiResponse<Foo>>(r => r.GetData() == new Foo());

        // Act
        await target.GetAsync<IPosApiResponse<Foo>, Foo>(TestMode, PosApiDataType.Static, testUrl);

        VerifyCache_GetOrCreateAsync<Foo>(PosApiDataType.Static, key: testUrl.ToString());
    }

    [Fact]
    public async Task GetAsyncWithDto_ShouldThrow_IfNoData()
    {
        RestClientResult = Mock.Of<IPosApiResponse<Foo>>();

        Func<Task> act = () => target.GetAsync<IPosApiResponse<Foo>, Foo>(TestMode, PosApiDataType.Static, testUrl);

        (await act.Should().ThrowAsync<Exception>())
            .Which.Message.Should().ContainAll("'test/url'", "null", typeof(Foo), typeof(IPosApiResponse<Foo>));
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public void InvalidateCached_ShouldRemoveCachedData(PosApiDataType dataType)
    {
        target.InvalidateCached(dataType, "CacheKey"); // Act

        Cache.Verify(c => c.RemoveAsync(ExecutionMode.Sync, dataType, "CacheKey"));
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public void SetToCache_ShouldSetDataToCache(PosApiDataType dataType)
    {
        var data = new object();

        target.SetToCache(dataType, "CacheKey", data); // Act

        Cache.Verify(c => c.SetAsync(ExecutionMode.Sync, dataType, "CacheKey", data, null));
    }
}
