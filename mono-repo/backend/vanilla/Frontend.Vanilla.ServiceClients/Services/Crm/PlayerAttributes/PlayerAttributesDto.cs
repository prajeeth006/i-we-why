using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;

internal sealed class PlayerAttributesDto(
    string accountName = null,
    Attributes attributes = null
) : IPosApiResponse<PlayerAttributesDto>
{
    public string AccountName { get; } = accountName;
    public Attributes Attributes { get; } = attributes;

    public PlayerAttributesDto GetData() => this;
}

internal sealed class Attributes(Dictionary<string, Attribute> acknowledgement = null, Dictionary<string, Attribute> vip = null)
{
    public Dictionary<string, Attribute> Acknowledgement { get; } = acknowledgement.NullToEmpty().ToDictionary();
    public Dictionary<string, Attribute> Vip { get; } = vip.NullToEmpty().ToDictionary();
}

internal sealed class Attribute(long updatedAt = 0, object value = null)
{
    public long UpdatedAt { get; } = updatedAt;
    public object Value { get; } = value;
}
