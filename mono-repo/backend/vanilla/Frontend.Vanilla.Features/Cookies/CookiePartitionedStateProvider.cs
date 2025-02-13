using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Cookies;

internal interface ICookiePartitionedStateProvider
{
    void SetPartitionedState(CookieOptions cookieOptions);
}

internal sealed class CookiePartitionedStateProvider(IDynaConCookieConfiguration dynaConConfig) : ICookiePartitionedStateProvider
{
    public void SetPartitionedState(CookieOptions cookieOptions)
    {
        if (dynaConConfig.SetPartitionedState)
            cookieOptions.Extensions.Add("Partitioned");
    }
}
