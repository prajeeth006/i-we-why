namespace Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;

internal sealed class MappedTrackerIdDto
{
    public int TrackerId { get; set; }

    public int WmId
    {
        set => TrackerId = value;
    }
}
