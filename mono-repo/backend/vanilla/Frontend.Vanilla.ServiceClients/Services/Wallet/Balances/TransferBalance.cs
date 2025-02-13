namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

/// <summary>
/// Tranfer Balance Model.
/// </summary>
public sealed class TransferBalance
{
    /// <summary>
    /// Amount to be transferred.
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// Source Balance type.
    /// </summary>
    public string FromBalanceType { get; set; }

    /// <summary>
    /// Destination balance type.
    /// </summary>
    public string ToBalanceType { get; set; }
}
