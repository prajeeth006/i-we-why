using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Badge;

internal class BadgeClientConfigProvider(IBadgeConfiguration badgeConfiguration) : LambdaClientConfigProvider("vnBadge", () => new { badgeConfiguration.CssClass }) { }
