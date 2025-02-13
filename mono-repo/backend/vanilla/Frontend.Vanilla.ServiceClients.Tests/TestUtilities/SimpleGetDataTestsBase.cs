using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Tests.TestUtilities;

public abstract class SimpleGetDataTestsBase
{
    internal Mock<IGetDataServiceClient> GetDataServiceClient { get; }
    internal ExecutionMode Mode { get; }

    public SimpleGetDataTestsBase()
    {
        TestCulture.Set("sw-KE");
        GetDataServiceClient = new Mock<IGetDataServiceClient>();
        Mode = TestExecutionMode.Get();
    }

    internal async Task RunTest<TDto, TData>(
        Func<Task<TData>> act,
        PosApiDataType expectedDataType,
        string expectedUrl,
        TData testData = default,
        string expectedCacheKey = null)
        where TDto : IPosApiResponse<TData>
        where TData : notnull
    {
        // Create mock for reference so that we don't need to create it in tests
        // But value types require explicit value to be set
        if (!typeof(TData).IsValueType && testData == null)
            testData = typeof(TData).IsInterface
                ? (TData)typeof(Mock).GetMethod("Of", Type.EmptyTypes).MakeGenericMethod(typeof(TData)).Invoke(null, null)
                : JsonConvert.DeserializeObject<TData>("{}");
        else if (testData.Equals(default(TData)))
            throw new Exception("TestData must be provided explicitly b/c mock can't be created for value types!");

        // Set up to capture parameters b/c it give nicer error than Verify()
        (ExecutionMode? Mode, PosApiDataType? DataType, Uri Url, bool Cached, RequiredString CacheKey, TimeSpan? relativeExpiration) received = default;
        GetDataServiceClient.SetupWithAnyArgs(c => c.GetAsync<TDto, TData>(default, default, null, default, null, null))
            .Callback((ExecutionMode mode, PosApiDataType dataType, Uri url, bool cached, RequiredString cacheKey, TimeSpan? relativeExpiration) => received = (mode, dataType, url, cached, cacheKey, relativeExpiration))
            .ReturnsAsync(testData);

        var data = await act();

        data.Should().Be(testData);
        received.Url.Should().Be(new Uri(expectedUrl, UriKind.Relative));
        received.DataType.Should().Be(expectedDataType);
        received.Mode.Should().Be(Mode);
        received.Cached.Should().BeTrue();
        received.CacheKey.Should().Be(RequiredString.TryCreate(expectedCacheKey));
    }
}
