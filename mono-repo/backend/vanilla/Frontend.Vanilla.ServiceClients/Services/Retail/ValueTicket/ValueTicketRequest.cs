using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;

/// <summary>
/// Value ticket request.
/// </summary>
public sealed class ValueTicketRequest
{
    /// <summary>
    /// Ticket ID.
    /// </summary>
    [Required]
    public string Id { get; set; }

    /// <summary>
    /// Source - e.g. Terminal.
    /// </summary>
    [Required]
    public string Source { get; set; }

    /// <summary>
    /// Shop ID - Required if the source is terminal.
    /// </summary>
    public string ShopId { get; set; }

    /// <summary>
    /// Terminal ID - Required if the source is terminal.
    /// </summary>
    public string TerminalId { get; set; }
}
