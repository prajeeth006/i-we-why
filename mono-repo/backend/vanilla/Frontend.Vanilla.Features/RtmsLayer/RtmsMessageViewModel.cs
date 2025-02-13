using System.Collections.Generic;
using Frontend.Vanilla.Features.Base.Models;
using Frontend.Vanilla.Features.Games;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal sealed class RtmsMessageViewModel : MessageResultBase<NotificationMessageContent>
{
    public IEnumerable<MobileGameInfo>? MobileGames { get; set; }
    public IEnumerable<MobileGameInfo>? DesktopGames { get; set; }
    public bool IsGamesLoadFailed { get; set; }
    public string? CampaignId { get; set; }
    public bool IsBonusTeaser { get; set; }
}
