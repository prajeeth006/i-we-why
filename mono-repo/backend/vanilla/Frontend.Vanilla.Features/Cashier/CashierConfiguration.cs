using System.Collections.Generic;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.Features.Cashier;

public interface ICashierConfiguration
{
    string DepositUrlTemplate { get; }
    string WithdrawUrlTemplate { get; }
    string TransactionHistoryUrlTemplate { get; }
    string UrlTemplate { get; }
    string ManageMyCardsUrlTemplate { get; }
    string QuickDepositUrlTemplate { get; }
    string PaymentPreferencesUrlTemplate { get; }
    string Host { get; }
    string SingleSignOnIntegrationType { get; }
    IReadOnlyDictionary<string, string> TrackerIds { get; }
    IReadOnlyDictionary<string, bool> QuickDepositAllowedOrigins { get; }
    bool IsQuickDepositEnabled { get; }
}

internal sealed class CashierConfiguration : ICashierConfiguration
{
    public const string FeatureName = "LabelHost.Cashier";

    public string DepositUrlTemplate { get; set; } = string.Empty;
    public string WithdrawUrlTemplate { get; set; } = string.Empty;
    public string TransactionHistoryUrlTemplate { get; set; } = string.Empty;
    public string UrlTemplate { get; set; } = string.Empty;
    public string ManageMyCardsUrlTemplate { get; set; } = string.Empty;
    public string PaymentPreferencesUrlTemplate { get; set; } = string.Empty;
    public string QuickDepositUrlTemplate { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;
    public string SingleSignOnIntegrationType { get; set; } = string.Empty;
    public IReadOnlyDictionary<string, string> TrackerIds { get; set; } = new Dictionary<string, string>();
    public IReadOnlyDictionary<string, bool> QuickDepositAllowedOrigins { get; set; } = new Dictionary<string, bool>();

    public bool IsQuickDepositEnabled { get; set; }
}
