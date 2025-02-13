using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;

/// <summary>
/// PayoutValueTicket request.
/// </summary>
public sealed class PayoutValueTicketRequest
{
    /// <summary>
    /// Value ticket ID.
    /// </summary>
    [Required]
    public string Id { get; set; }

    /// <summary>
    /// Agent name.
    /// </summary>
    public string AgentName { get; set; }

    /// <summary>
    /// Description.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Shop ID.
    /// </summary>
    public string ShopId { get; set; }

    /// <summary>
    /// Source.
    /// </summary>
    public string Source { get; set; }

    /// <summary>
    /// Terminal ID.
    /// </summary>
    public string TerminalId { get; set; }
}
