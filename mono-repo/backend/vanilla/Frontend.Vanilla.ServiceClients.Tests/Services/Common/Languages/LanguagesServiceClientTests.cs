using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Languages;

public sealed class LanguagesServiceClientTests : ServiceClientTestsBase
{
    private ILanguagesServiceClient target;
    private Language[] langs;

    protected override void Setup()
    {
        target = new LanguagesServiceClient(RestClient.Object, Cache.Object);

        langs = new[] { new Language(), new Language() };
        RestClientResult = new LanguagesResponse { Languages = langs };
    }

    [Fact]
    public async Task GetCachedAsync_ShouldExecuteCorrectly()
    {
        // Act
        var result = await target.GetCachedAsync(TestMode);

        result.Should().Equal(langs);
        VerifyRestClient_ExecuteAsync("Common.svc/Language/?lang=sw-KE", resultType: typeof(LanguagesResponse));
        VerifyCache_GetOrCreateAsync<IReadOnlyList<Language>>(PosApiDataType.Static, "Languages:sw-KE");
    }

    [Fact]
    public async Task GetFreshAsync_ShouldExecuteCorrectly()
    {
        // Act
        var result = await target.GetFreshAsync(TestMode);

        result.Should().Equal(langs);
        CacheGetOrCreateAsyncCalls.Should().BeEmpty();
        Cache.Verify(c => c.SetAsync(ExecutionMode.Sync, PosApiDataType.Static, "Languages:sw-KE", langs, null)); // Still should be set to cache
    }
}
