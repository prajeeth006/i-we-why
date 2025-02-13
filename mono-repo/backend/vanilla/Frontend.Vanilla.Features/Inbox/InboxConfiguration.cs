#nullable disable
namespace Frontend.Vanilla.Features.Inbox;

internal interface IInboxConfiguration
{
    bool Enabled { get; }
    int ReadTime { get; }
    string MobileCasinoGameDataEndpoint { get; }
    LazyLoading LazyLoading { get; }
    bool UseRtms { get; }
    int CounterPullInterval { get; }
    bool TriggerJumioFromPlayerInbox { get; }
    string JumioKycUrl { get; }
    bool ShowOfferMessage { get; }
}

internal sealed class InboxConfiguration : IInboxConfiguration
{
    public const string FeatureName = "SFAPI.Features.Inbox";
    public bool Enabled { get; set; }
    public int ReadTime { get; set; }
    public string MobileCasinoGameDataEndpoint { get; set; }
    public LazyLoading LazyLoading { get; set; }
    public bool UseRtms { get; set; }
    public int CounterPullInterval { get; set; }
    public bool TriggerJumioFromPlayerInbox { get; set; }
    public string JumioKycUrl { get; set; }
    public bool ShowOfferMessage { get; set; }
}

internal class LazyLoading(int pageSize, int loadBeforeItems)
{
    public int PageSize { get; } = pageSize;
    public int LoadBeforeItems { get; } = loadBeforeItems;
}
