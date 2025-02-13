using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Manager;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Manager;

public class PostLoginValuesManagerTests
{
    private Mock<ILabelIsolatedDistributedCache> distributedCache;
    private Mock<ILoginResult> loginResult;
    private IPostLoginValuesManager target;
    private IReadOnlyDictionary<string, object> data;
    private CancellationToken ct;

    public PostLoginValuesManagerTests()
    {
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        var currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new PostLoginValuesManager(currentUserAccessor.Object, distributedCache.Object);

        loginResult = new Mock<ILoginResult>();
        ct = TestCancellationToken.Get();
        loginResult.SetupGet(x => x.PostLoginValues).Returns(
            new Dictionary<string, string>()
            {
                { "nO_OF_HOURS_LEFT", "1" },
                { "day_of_the_week", "Friday" },
                { "is_online", "True" },
            });
        data = new Dictionary<string, object>
        {
            { "NoOfHoursLeft", "1" },
            { "DayOfTheWeek", "Friday" },
            { "IsOnline", true },
        };
        currentUserAccessor.SetupGet(a => a.User).Returns(
            new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(PosApiClaimTypes.SessionToken, "session-token"),
                        new Claim(PosApiClaimTypes.UserToken, "user-token"),
                    })));
    }

    [Fact]
    public void StorePostLoginValues_IfPostLoginValuesNull_ShouldReturnFalse()
    {
        loginResult.SetupGet(x => x.PostLoginValues).Returns((Dictionary<string, string>)null);
        var result = target.StorePostLoginValues(loginResult.Object);

        result.Should().BeFalse();
    }

    [Fact]
    public void StorePostLoginValues_ShouldStoreInNewDistributedCache()
    {
        var encodedData = JsonConvert.SerializeObject(data).EncodeToBytes();
        var result = target.StorePostLoginValues(loginResult.Object);

        result.Should().BeTrue();
        distributedCache.Verify(x => x.Set("LoginResult-session-token", encodedData, It.IsAny<DistributedCacheEntryOptions>()), Times.Once);
    }

    [Fact]
    public async Task GetPostLoginValues_FromNewDistributedCache()
    {
        var encodedData = JsonConvert.SerializeObject(data).EncodeToBytes();
        distributedCache.Setup(x => x.GetAsync("LoginResult-session-token", ct)).ReturnsAsync(encodedData);

        var result = await target.GetPostLoginValuesAsync(ExecutionMode.Async(ct));

        result.Should().BeEquivalentTo(data);
    }
}
