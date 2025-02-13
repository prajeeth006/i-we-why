using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Moq;

namespace Frontend.Vanilla.ServiceClients.Tests.AcceptanceTests;

public abstract class AcceptanceTestsBase<TService>
{
    protected TService Service { get; private set; }
    internal Mock<RestClientBase> RestClient { get; private set; }
    protected MemoryCache Cache { get; private set; }
    protected List<RestRequest> ExecutedRequests { get; private set; }

    public AcceptanceTestsBase()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("en-US"));
        RestClient = new Mock<RestClientBase>();
        ExecutedRequests = new List<RestRequest>();
        Cache = new MemoryCache(new OptionsWrapper<MemoryCacheOptions>(new MemoryCacheOptions())); // Recreate to avoid cached values from previous execution

        var services = new ServiceCollection()
            .AddVanillaServiceClients()
            .AddSingleton(GetConfig())
            .AddSingleton(new BettingServiceClientsConfiguration())
            .AddSingleton(new ExtendedServiceClientsConfiguration())
            .AddSingleton((IRestClient)RestClient.Object)
            .AddSingleton(new Mock<IConfiguration>().WithConnectionStrings().Object)
            .AddSingleton(Cache)
            .BuildServiceProvider();

        Service = services.GetRequiredService<TService>();

        RestClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null))
            .ReturnsAsync(
                (ExecutionMode m, RestRequest r) =>
                {
                    ExecutedRequests.Add(r);

                    return new RestResponse(r) { StatusCode = HttpStatusCode.NotFound };
                });
    }

    protected virtual ServiceClientsConfigurationBuilder GetConfig()
        => new ServiceClientsConfigurationBuilder
        {
            Host = new Uri("http://api.bwin.com/"),
            Version = "V3",
            StaticDataCacheTime = TimeSpan.FromMinutes(5),
            UserDataCacheTime = TimeSpan.FromMinutes(10),
            HealthInfoExpiration = TimeSpan.FromMinutes(20),
            AccessId = "accessid",
            TimeoutRules = { new ServiceClientTimeoutRule(".*", TimeSpan.FromSeconds(5)) },
        };

    protected void SetupRestResponse(string pathSubstr, string embeddedFile = null, HttpStatusCode statusCode = HttpStatusCode.OK)
        => RestClient.Setup(c =>
                c.ExecuteAsync(It.IsAny<ExecutionMode>(), It.Is<RestRequest>(r => r.Url.AbsolutePath.Contains(pathSubstr, StringComparison.OrdinalIgnoreCase))))
            .ReturnsAsync(
                (ExecutionMode m, RestRequest r) =>
                {
                    ExecutedRequests.Add(r);

                    return new RestResponse(r)
                    {
                        StatusCode = statusCode,
                        Content = embeddedFile != null ? EmbeddedResource.FromThisAssembly(embeddedFile) : Array.Empty<byte>(),
                    };
                });

    protected void Verify(RestRequest request, string expectedUrl, TimeSpan? expectedTimeout = null)
    {
        request.Method.Should().Be(HttpMethod.Get);
        request.Url.Should().BeUriWithAnyQueryOrder(expectedUrl);

        if (expectedTimeout.HasValue)
            request.Timeout.Should().Be(expectedTimeout.Value);
    }
}
