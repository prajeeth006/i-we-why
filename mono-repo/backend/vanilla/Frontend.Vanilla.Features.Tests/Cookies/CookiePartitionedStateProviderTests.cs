using System.Linq;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public sealed class CookiePartitionedStateProviderTests
{
    private ICookiePartitionedStateProvider target;
    private Mock<IDynaConCookieConfiguration> dynaConCookieConfiguration;

    public CookiePartitionedStateProviderTests()
    {
        dynaConCookieConfiguration = new Mock<IDynaConCookieConfiguration>();

        target = new CookiePartitionedStateProvider(dynaConCookieConfiguration.Object);
    }

    [Theory, BooleanData]
    public void GetValue_ShouldReturnValue(bool setPartitionState)
    {
        var cookieOptions = new CookieOptions();
        dynaConCookieConfiguration.SetupGet(c => c.SetPartitionedState).Returns(setPartitionState);

        target.SetPartitionedState(cookieOptions);

        Assert.Equal(cookieOptions.Extensions.Any(e => e == "Partitioned"), setPartitionState);
    }
}
