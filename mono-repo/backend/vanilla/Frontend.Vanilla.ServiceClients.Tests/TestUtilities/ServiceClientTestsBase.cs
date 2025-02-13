using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;

namespace Frontend.Vanilla.ServiceClients.Tests.TestUtilities;

public abstract class ServiceClientTestsBase
{
    protected ExecutionMode TestMode { get; set; }

    internal Mock<NonGenericPosApiRestClient> RestClient { get; set; }
    protected object RestClientResult { get; set; }
    protected List<ReceivedRestCall> RestClientCalls { get; set; }

    internal Mock<NonGenericPosApiDataCache> Cache { get; set; }
    protected List<ReceivedCacheCall> CacheGetOrCreateAsyncCalls { get; set; }

    protected ServiceClientTestsBase()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        RestClient = new Mock<NonGenericPosApiRestClient>();
        RestClientResult = null;
        RestClientCalls = new List<ReceivedRestCall>();
        Cache = new Mock<NonGenericPosApiDataCache>();
        CacheGetOrCreateAsyncCalls = new List<ReceivedCacheCall>();
        TestMode = TestExecutionMode.Get();
        Setup();

        RestClient.SetupWithAnyArgs(c => c.Execute(default, null, null)).Returns(
            (ExecutionMode m, PosApiRestRequest r, Type t) =>
            {
                RestClientCalls.Add(new ReceivedRestCall { Mode = m, Request = r, ResultType = t });

                return t == null || t.IsInstanceOfType(RestClientResult)
                    ? RestClientResult
                    : throw new Exception(
                        $"Requested result type {t} but mocked result of type {RestClientResult?.GetType().ToString() ?? "null"} can't be assigned to it.");
            });

        Cache.SetupWithAnyArgs(c => c.GetOrCreateAsync(default, default, null, null, null, default, null))
            .Returns((
                ExecutionMode mode,
                PosApiDataType dataType,
                RequiredString key,
                Type resultType,
                Func<Task<object>> valueFactory,
                bool cached,
                TimeSpan? relativeExpiration) =>
            {
                CacheGetOrCreateAsyncCalls.Add(new ReceivedCacheCall
                {
                    Mode = mode,
                    DataType = dataType,
                    Key = key,
                    ResultType = resultType,
                    Cached = cached,
                    RelativeExpiration = relativeExpiration,
                });

                return valueFactory();
            });
    }

    protected abstract void Setup();

    protected void VerifyRestClient_ExecuteAsync(
        string url,
        HttpMethod method = null,
        bool authenticate = false,
        RestRequestHeaders headers = null,
        bool hasContent = false,
        object content = null,
        Type resultType = null,
        ExecutionMode? mode = null)
    {
        var call = RestClientCalls.Should().HaveCount(1).And.Subject.Single();

        call.Mode.Should().Be(mode ?? TestMode);
        call.ResultType.Should().Be(resultType);
        call.Request.Verify(url, method, authenticate, headers, hasContent, content);
    }

    protected void VerifyCache_GetOrCreateAsync<TResult>(PosApiDataType dataType, string key, bool cached = true, TimeSpan? relativeExpiration = null)
    {
        var call = CacheGetOrCreateAsyncCalls.Should().HaveCount(1).And.Subject.Single();

        call.Mode.Should().Be(TestMode);
        call.DataType.Should().Be(dataType);
        call.Key.Should().Be(key);
        call.ResultType.Should().Be(typeof(TResult));
        call.Cached.Should().Be(cached);
        call.RelativeExpiration.Should().Be(relativeExpiration);
    }

    protected class ReceivedRestCall
    {
        public PosApiRestRequest Request { get; set; }
        public ExecutionMode Mode { get; set; }
        public Type ResultType { get; set; }
    }

    protected class ReceivedCacheCall
    {
        public ExecutionMode Mode { get; set; }
        public PosApiDataType DataType { get; set; }
        public RequiredString Key { get; set; }
        public Type ResultType { get; set; }
        public bool Cached { get; set; }
        public TimeSpan? RelativeExpiration { get; set; }
    }
}
