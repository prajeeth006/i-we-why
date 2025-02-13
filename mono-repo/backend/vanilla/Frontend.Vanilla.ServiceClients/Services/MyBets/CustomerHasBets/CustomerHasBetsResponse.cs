namespace Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;

internal sealed class CustomerHasBetsResponse
{
    public CustomerHasBetsResponse(bool hasBets)
    {
        HasBets = hasBets;
    }

    public bool HasBets { get; }
}
