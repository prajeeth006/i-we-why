using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Content.Menus;

/// <summary>
/// Represents a single menu item.
/// </summary>
public class MenuItem
{
    /// <summary>
    /// Text of the menu item.
    /// </summary>
    public string Text { get; set; }

    /// <summary>
    /// Url that the menu item will link to.
    /// </summary>
    public Uri Url { get; set; }

    /// <summary>
    /// CSS class to add to the menu item.
    /// </summary>
    public string Class { get; set; }

    /// <summary>
    /// The target for the link.
    /// </summary>
    public string Target { get; set; }

    /// <summary>
    /// The rel for the link.
    /// </summary>
    public string Rel { get; set; }

    /// <summary>
    /// Name of the menu action to invoke when the menu item is clicked.
    /// </summary>
    public string ClickAction { get; set; }

    /// <summary>
    /// Authstate to use for *vnAuthstate.
    /// </summary>
    public JObject Authstate { get; set; }

    /// <summary>
    /// Image to be used for image link (optional, only used in some templates).
    /// </summary>
    public ContentImage Image { get; set; }

    /// <summary>
    /// Name of the menu item. Can be used to access the section programatically.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Type of the menu item. Determines which template will be used for rendering.
    /// </summary>
    public string Type { get; set; }

    /// <summary>
    /// Type of the menu item. Determines which template will be used for rendering when this item is the root item.
    /// </summary>
    public string Layout { get; set; }

    /// <summary>
    /// Multilayer menu route.
    /// </summary>
    public string MenuRoute { get; set; }

    /// <summary>
    /// Multilayer menu route to parent item.
    /// </summary>
    public string MenuRouteParent { get; set; }

    /// <summary>
    /// DSL condition.
    /// </summary>
    public string Condition { get; set; }

    /// <summary>
    /// Track event data. Used as input to trackingService.triggerEvent(name, data).
    /// </summary>
    /// <remarks>Extracted from html attribute keys starting with "tracking.*".</remarks>
    /// <example>
    /// <code>
    /// tracking.eventName: name
    /// tracking.data.page.referringAction: action
    /// ==>
    /// { "eventName": "name", "data": { "page.referringAction": "action" } }
    /// </code>
    /// </example>
    public JObject TrackEvent { get; set; }

    /// <summary>
    /// Track event data. Used as input to trackingService.triggerEvent(name, data).
    /// </summary>
    public string WebAnalytics { get; set; }

    /// <summary>
    /// Additional parameters.
    /// </summary>
    public IReadOnlyDictionary<string, string> Parameters { get; set; }

    /// <summary>
    /// Additional resources.
    /// </summary>
    public IReadOnlyDictionary<string, string> Resources { get; set; }

    /// <summary>
    /// Child items.
    /// </summary>
    public IReadOnlyList<MenuItem> Children { get; set; }

    /// <summary>
    /// SubNavigationContainer.
    /// </summary>
    public string SubNavigationContainer { get; set; }

    /// <summary>
    /// ToolTip.
    /// </summary>
    public string ToolTip { get; set; }

    /// <summary>
    /// Image Source.
    /// </summary>
    public ContentImage SvgImage { get; set; }

    /// <summary>
    /// View box.
    /// </summary>
    public string ViewBox { get; set; }

    /// <summary>
    /// Svg Image size.
    /// </summary>
    public string Size { get; set; }

    /// <summary>
    /// Svg Icon type.
    /// </summary>
    public string IconType { get; set; }

    /// <summary>
    /// Animated.
    /// </summary>
    public bool DefaultAnimation { get; set; }

    /// <summary>
    /// Custom animation.
    /// </summary>
    public string CustomAnimation { get; set; }

    /// <summary>
    /// Css Class.
    /// </summary>
    public string CssClass { get; set; }

    /// <summary>
    /// Icon Name.
    /// </summary>
    public string IconName { get; set; }
}

internal sealed class MenuProxyItem : MenuItem
{
    public bool IsProxy => true;
    public IReadOnlyList<MenuItemProxyRule> Rules { get; set; }
}

internal sealed class MenuItemProxyRule
{
    public string Condition { get; set; }
    public MenuItem Document { get; set; }
}
