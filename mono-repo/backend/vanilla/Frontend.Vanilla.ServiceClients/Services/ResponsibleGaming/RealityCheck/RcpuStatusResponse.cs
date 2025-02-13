namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;

/// <summary>
/// RCPU Status Response from the RCPU status endpoint.
/// </summary>
public sealed class RcpuStatusResponse
{
    /// <summary>Creates a new instance.</summary>
    public RcpuStatusResponse(double balance = 0, long elapsedTime = 0, long totalWagerAmt = 0, string playerState = null)
    {
        Balance = balance;
        ElapsedTime = elapsedTime;
        TotalWagerAmt = totalWagerAmt;
        PlayerState = playerState;
    }

    /// <summary>Player balance.</summary>
    public double Balance { get; }

    /// <summary>Elapsed time.</summary>
    public long ElapsedTime { get; }

    /// <summary>Total wager amount.</summary>
    public long TotalWagerAmt { get; }

    /// <summary>Player state.</summary>
    public string PlayerState { get; }
}
