#nullable enable

using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Content.Menus;

/// <summary>
/// Represents a section of a menu.
/// </summary>
public class MenuSection
{
    /// <summary>
    /// Name of the section. Can be used to access the section programatically.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Title of the section.
    /// </summary>
    public string? Title { get; set; }

    /// <summary>
    /// CSS class to add to the section.
    /// </summary>
    public string? Class { get; set; }

    /// <summary>
    /// Authstate to use for *vnAuthstate.
    /// </summary>
    public JObject? Authstate { get; set; }

    /// <summary>
    /// DSL condition.
    /// </summary>
    public string? Condition { get; set; }

    /// <summary>
    /// Child menu items.
    /// </summary>
    public IReadOnlyList<MenuItem>? Items { get; set; }
}
