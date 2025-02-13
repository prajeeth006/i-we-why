using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;

/// <summary>
/// Terminal details request.
/// </summary>
public class TerminalDetailsRequest
{
    /// <summary>
    /// Shop ID.
    /// </summary>
    [Required]
    public string ShopId { get; set; }

    /// <summary>
    /// Terminal ID.
    /// </summary>
    [Required]
    public string TerminalId { get; set; }

    /// <summary>
    /// Is value from cache.
    /// </summary>
    public bool Cached { get; set; } = true;
}
