#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.Features.Games;

namespace Frontend.Vanilla.Features.Base.Models;

internal abstract class MessageResultBase<TContent>
{
    public string Id { get; set; }
    public string MessageType { get; set; }

    public string SourceStatus { get; set; }

    public TContent Content { get; set; }
    public string OfferId { get; set; }
    public bool IsNoDepositBonus { get; set; }
    public string BonusCode { get; set; }
    public bool IsTnCTemplate { get; set; }
    public string TnCData { get; set; }
    public string SitecoreId { get; set; }

    public List<MobileGameInfo> DesktopGameList { get; set; }
    public List<MobileGameInfo> MobileGameList { get; set; }
    public List<GameAllInfo> DesktopAllList { get; set; }
    public List<GameAllInfo> MobileAllList { get; set; }
    public string[] DesktopChannelList { get; set; }
    public string[] MobileChannelList { get; set; }
    public List<KeyValuePair<string, List<MobileGameInfo>>> DesktopSectionGamesPairs { get; set; }
    public List<KeyValuePair<string, List<MobileGameInfo>>> MobileSectionGamesPairs { get; set; }
    public bool IsAllMobileGames { get; set; }
    public bool IsAllDesktopGames { get; set; }
    public string CasinoHomeLink { get; set; }
    public string ChannelId { get; set; }
    public string CasinoAllGamesIconSrc { get; set; }
    public string BonusSourceStatus { get; set; }
    public bool IsCampaignBonus { get; set; }
    public string BonusId { get; set; }
    public bool IsBonusTncAccepted { get; set; }
}
