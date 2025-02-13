using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;

internal sealed class CommunicationType(int id = 0, string name = null, bool selected = false)
{
    public int Id { get; } = id;
    public string Name { get; } = name;
    public bool Selected { get; } = selected;
}

internal sealed class CommunicationSettingsResponse : IPosApiResponse<IReadOnlyList<CommunicationType>>
{
    public IReadOnlyList<CommunicationType> CommunicationTypes { get; set; }
    public IReadOnlyList<CommunicationType> GetData() => CommunicationTypes;
}
