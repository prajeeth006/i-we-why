using System.Security.Claims;
using System.Threading;

namespace Frontend.Vanilla.Core.Time.Background;

/// <summary>
/// Sets explicit anonymous user for background operation.
/// </summary>
internal sealed class UserBackgroundWorkInitializer : IBackgroundWorkInitializer
{
    public SetupBackgroundContextHandler CaptureParentContext()
        => () =>
        {
            var claims = new[] { new Claim(ClaimsIdentity.DefaultNameClaimType, "Background Worker") };
            Thread.CurrentPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        };
}
