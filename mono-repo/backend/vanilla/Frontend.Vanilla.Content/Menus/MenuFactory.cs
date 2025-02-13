#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Content.Menus;

internal sealed class MenuFactory(IContentService contentService, ILogger<MenuFactory> log, IDslCompiler dslCompiler) : IMenuFactory
{
    private readonly IContentService contentService = Guard.NotNull(contentService, nameof(contentService));
    private readonly ILogger log = Guard.NotNull(log, nameof(log));
    private readonly IDslCompiler dslCompiler = Guard.NotNull(dslCompiler, nameof(dslCompiler));
    private const string DslPrefix = "DSL:";

    public async Task<IReadOnlyList<MenuSection>> GetSectionsAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        try
        {
            var documents = await contentService.GetChildrenAsync<IDocument>(
                path,
                cancellationToken,
                new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = 2 });

            var sections = await Task.WhenAll(documents.Select(c =>
                GetSectionInternal((_, _, _) => Task.FromResult<IDocument?>(c), c.Metadata.Id, dslEvaluation, cancellationToken)));

            return sections.WhereNotNull().Where(s => s.Items?.Count > 0).ToList();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of menu sections from {path} failed", path);

            return Array.Empty<MenuSection>().ToList();
        }
    }

    public Task<MenuSection?> GetSectionAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        return GetSectionInternal((p, ct, o) => contentService.GetRequiredAsync<IDocument>(p, ct, o).AsNullableResult(), path, dslEvaluation, cancellationToken);
    }

    public Task<MenuSection?> GetOptionalSectionAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        return GetSectionInternal((p, ct, o) => contentService.GetAsync<IDocument>(p, ct, o), path, dslEvaluation, cancellationToken);
    }

    private async Task<MenuSection?> GetSectionInternal(
        Func<DocumentId, CancellationToken, ContentLoadOptions, Task<IDocument?>> getter,
        DocumentId path,
        DslEvaluation dslEvaluation,
        CancellationToken cancellationToken)
    {
        try
        {
            var section = await getter(path, cancellationToken, new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = 1 });

            if (section == null)
                return null;

            var menuItem = await GetItemAsync(section, dslEvaluation, cancellationToken);

            if (menuItem == null)
                return null;

            return new MenuSection
            {
                Authstate = menuItem.Authstate,
                Class = menuItem.Class,
                Condition = menuItem.Condition,
                Items = menuItem.Children ?? Array.Empty<MenuItem>(),
                Name = menuItem.Name,
                Title = menuItem.Text,
            };
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of menu section from {path} failed", path);

            return null;
        }
    }

    /// <summary>
    /// This method won't log error to Kibana in case item does not exist.
    /// </summary>
    /// <param name="path"></param>
    /// <param name="dslEvaluation"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<MenuItem?> GetOptionalItemAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        try
        {
            var item = await contentService.GetAsync<IDocument>(
                path,
                cancellationToken,
                new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = 10 });

            if (item == null)
                return null;

            return await GetItemAsync(item, dslEvaluation, cancellationToken);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of optional menu items from {path} failed", path);

            return null;
        }
    }

    public async Task<MenuItem?> GetItemAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        try
        {
            var item = await contentService.GetRequiredAsync<IDocument>(
                path,
                cancellationToken,
                new ContentLoadOptions { DslEvaluation = dslEvaluation, PrefetchDepth = 10 });

            return await GetItemAsync(item, dslEvaluation, cancellationToken);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of menu items from {path} failed", path);

            return null;
        }
    }

    private async Task<MenuItem?> GetItemAsync(IDocument item, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        MenuItem? menuItem = null;

        switch (item)
        {
            case IMenuItemTemplate m:
                menuItem = await Transform(m, dslEvaluation, cancellationToken);

                break;
            case IMenuItem mi:
                menuItem = await Transform(mi, dslEvaluation, cancellationToken);

                break;
            case IPCImage image:
                menuItem = Transform(image);

                break;
            case IProxy proxy:
                return await Transform(proxy, cancellationToken);
            case IVanillaProxyFolder proxyFolder:
                return await Transform(proxyFolder, cancellationToken);
        }

        if (menuItem == null)
        {
            log.LogError("Menu item {itemId} is of unsupported template type {templateName}", item.Metadata.Id, item.Metadata.TemplateName);

            return null;
        }

        menuItem.Resources = menuItem.Resources ?? new Dictionary<string, string>().AsReadOnly();

        if (item.Metadata.ChildIds.Any())
        {
            var childrenDocuments = await contentService.GetAsync<IDocument>(item.Metadata.ChildIds, cancellationToken, dslEvaluation);
            var childrenItems = await Task.WhenAll(childrenDocuments.ConvertAll(c => GetItemAsync(c, dslEvaluation, cancellationToken)));
            menuItem.Children = childrenItems.Where(i => i != null).ToList();
        }

        return menuItem;
    }

    private async Task<MenuItem> Transform(IMenuItem menuItem, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        var item = await CreateMenuItem(menuItem, menuItem.Parameters, menuItem.Link, dslEvaluation, cancellationToken);

        item.Text = menuItem.Text.WhiteSpaceToNull() ?? menuItem.Link?.Text.WhiteSpaceToNull();
        item.Image = menuItem.Image;
        item.Resources = menuItem.Resources;
        item.ToolTip = menuItem.ToolTip;
        item.SvgImage = menuItem.SvgImage;
        item.ViewBox = menuItem.ViewBox;
        item.Size = menuItem.Size;
        item.DefaultAnimation = menuItem.DefaultAnimation;
        item.CustomAnimation = menuItem.CustomAnimation;
        item.IconType = menuItem.Type;
        item.CssClass = menuItem.CssClass;

        return item;
    }

    private async Task<MenuItem> Transform(IMenuItemTemplate menuItem, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        var item = await CreateMenuItem(menuItem, menuItem.HtmlAttributes, menuItem.LinkReference, dslEvaluation, cancellationToken);

        item.Text = menuItem.LinkText.WhiteSpaceToNull() ?? menuItem.LinkReference?.Text.WhiteSpaceToNull();
        item.Image = menuItem.Image;
        item.SubNavigationContainer = menuItem.SubNavigationContainer;
        item.ToolTip = menuItem.ToolTip;

        return item;
    }

    private MenuItem Transform(IPCImage image)
    {
        var item = CreateMenuItem(image, image.Parameters, image.ImageLink);

        item.Text = image.Title.WhiteSpaceToNull() ?? image.ImageLink?.Text.WhiteSpaceToNull();
        item.Image = image.Image;
        item.Type = item.Type ?? "icon";
        item.Class = image.Class ?? image.Class.WhiteSpaceToNull();
        item.ToolTip = image.ToolTip;
        item.IconName = image.IconName;

        return item;
    }

    private async Task<MenuItem> Transform(IProxy proxy, CancellationToken cancellationToken)
    {
        var rules = await Task.WhenAll(proxy.Target.Select(ConvertRule));

        return new MenuProxyItem { Rules = rules };

        async Task<MenuItemProxyRule> ConvertRule(ProxyRule rule)
        {
            var item = rule.TargetId != null ? await GetItemAsync(rule.TargetId, DslEvaluation.PartialForClient, cancellationToken) : null;

            return new MenuItemProxyRule
            {
                Condition = rule.Condition,
                Document = item,
            };
        }
    }

    private async Task<MenuItem> Transform(IVanillaProxyFolder proxy, CancellationToken cancellationToken)
    {
        var rules = await Task.WhenAll(proxy.Target.Select(ConvertRule));

        return new MenuProxyItem { Rules = rules };

        async Task<MenuItemProxyRule> ConvertRule(ProxyFolderChildItem rule)
        {
            return new MenuItemProxyRule
            {
                Condition = rule.Condition,
                Document = await GetItemAsync(rule.Document, DslEvaluation.PartialForClient, cancellationToken),
            };
        }
    }

    private MenuItem CreateMenuItem(IFilterTemplate document, IReadOnlyDictionary<string, string?> documentAttrs, ContentLink? link)
    {
        var attrs = new Dictionary<string, string?> { documentAttrs };

        if (link != null)
        {
            attrs.Add(link.Attributes, KeyConflictResolution.Skip);
        }

        return BuildItem(document, link, attrs);
    }

    private async Task<MenuItem> CreateMenuItem(
        IFilterTemplate document,
        IReadOnlyDictionary<string, string?> documentAttrs,
        ContentLink? link,
        DslEvaluation dslEvaluation,
        CancellationToken cancellationToken)
    {
        var attrs = new Dictionary<string, string?> { documentAttrs };

        if (link != null)
        {
            attrs.Add(link.Attributes, KeyConflictResolution.Skip);
        }

        await EvaluateDslExpressions(document.Metadata.Id, attrs, dslEvaluation, cancellationToken);

        return BuildItem(document, link, attrs);
    }

    private MenuItem BuildItem(IFilterTemplate document, ContentLink? link, Dictionary<string, string?> attrs)
    {
        return new MenuItem
        {
            Name = attrs.GetValue(Fields.Name)?.ToLower() ?? document.Metadata.Id.ItemName,
            Url = link?.Url ?? (Uri.TryCreate(attrs.GetValue(Fields.Href), UriKind.RelativeOrAbsolute, out var url) ? url : null),
            Target = attrs.GetValue(Fields.Target),
            ClickAction = attrs.GetValue(Fields.ClickAction),
            Class = attrs.GetValue(Fields.Class),
            Authstate = ParseJson(attrs.GetValue(Fields.Authstate), document, "attribute authstate"),
            Type = attrs.GetValue(Fields.Type),
            Layout = attrs.GetValue(Fields.Layout),
            MenuRoute = attrs.GetValue(Fields.MenuRoute),
            MenuRouteParent = attrs.GetValue(Fields.MenuRouteParent),
            Rel = attrs.GetValue(Fields.Rel),
            Condition = document.Condition,
            TrackEvent = ExtractMultipleFieldsToJsonWithData(Fields.TrackEvent, attrs, document, "attributes tracking.*"),
            WebAnalytics = ExtractWebAnalyticsData(document),
            Parameters = RemoveCommonParams(attrs),
        };
    }

    private async Task EvaluateDslExpressions(DocumentId id, Dictionary<string, string?> attrs, DslEvaluation dslEvaluation, CancellationToken cancellationToken)
    {
        foreach (var attr in attrs.Where(p => p.Value?.TrimStart().StartsWith(DslPrefix) == true).ToList())
            try
            {
                var expressionStr = attr.Value!.Substring(DslPrefix.Length);
                var (expression, warnings) = dslCompiler.Compile<object>(expressionStr);

                if (warnings.Count > 0)
                    log.LogWarning("MenuItem {contentId} contains {dslEpression} with {warnings}", id.ToString(), expressionStr, warnings.ToDebugString());

                if (dslEvaluation == DslEvaluation.PartialForClient)
                {
                    var evaluationResult = await expression.EvaluateForClientAsync(cancellationToken);
                    attrs[attr.Key] = GetDslEvaluationResultClientString(evaluationResult);
                }
                else
                {
                    attrs[attr.Key] = (await expression.EvaluateAsync(cancellationToken)).ToString();
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "MenuItem {contentId} contains {attribute} with invalid DSL expression", id, attr.Key);
            }
    }

    private static string GetDslEvaluationResultClientString(ClientEvaluationResult<object> evaluationResult)
    {
        if (evaluationResult.HasFinalValue)
        {
            if (evaluationResult.Value is bool value)
            {
                return value.ToString().ToLower();
            }

            return evaluationResult.Value.ToString()!;
        }

        return evaluationResult.ClientExpression;
    }

    private static class Fields
    {
        public const string Name = "name";
        public const string Href = "href";
        public const string Target = "target";
        public const string ClickAction = "click-action";
        public const string Authstate = "authstate";
        public const string Type = "type";
        public const string Layout = "layout";
        public const string MenuRoute = "menu-route";
        public const string MenuRouteParent = "menu-route-parent";
        public const string Class = "class";
        public const string Rel = "rel";
        public const string TrackEvent = "tracking.*";

        public static readonly HashSet<string> All = new (
            new[]
            {
                Name, Href, Target, ClickAction, Authstate, Type, Layout, MenuRoute, Class, Rel, TrackEvent,
            });

        public static readonly HashSet<string> WithChildProperties =
            new (All.Where(f => f.EndsWith(".*")).Select(f => $"^{f.RemoveSuffix(".*")}\\.*") /* e.g. ^tracking.\\.* */);
    }

    private IReadOnlyDictionary<string, string?> RemoveCommonParams(IReadOnlyDictionary<string, string?> collection)
    {
        return collection.Where(kv => !Fields.All.Contains(kv.Key) && !Fields.WithChildProperties.Any(f => Regex.IsMatch(kv.Key, f)))
            .ToDictionary().AsReadOnly();
    }

    private JObject? ParseJson(string? str, IDocument item, string description)
    {
        if (str.IsNullOrEmpty())
            return null;

        try
        {
            return JObject.Parse(str);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "JSON parse for a menu item with {id} failed with {description}", item.Metadata.Id, description);

            return null;
        }
    }

    private static string? ExtractWebAnalyticsData(IDocument item)
    {
        item.Data.Fields.TryGetValue("WebAnalytics", out var webAnalytics);

        return webAnalytics?.ToString();
    }

    private JObject? ExtractMultipleFieldsToJsonWithData(string fieldIdentifier, IReadOnlyDictionary<string, string?> collection, IDocument item, string description)
    {
        if (string.IsNullOrEmpty(fieldIdentifier))
            return null;

        if (!fieldIdentifier.EndsWith(".*"))
            throw new ArgumentException("Field identifier must end with \".*\" to extract from multiple fields.", fieldIdentifier);

        try
        {
            var rootPrefix = fieldIdentifier.TrimEnd('*');
            var dataPrefix = rootPrefix + "data.";

            var keys = collection.Keys.Where(k => k.StartsWith(rootPrefix)).ToArray();
            var propertyKeys = keys.Where(k => !k.StartsWith(dataPrefix)).ToArray();

            var result = propertyKeys.Aggregate(new Dictionary<string, object?>(),
                (dict, key) =>
                {
                    dict[key.Replace(rootPrefix, "")] = collection[key];

                    return dict;
                });

            var dataKeys = keys.Except(propertyKeys);
            var data = dataKeys
                .Aggregate(
                    new Dictionary<string, object?>(),
                    (dict, key) =>
                    {
                        dict[key.Replace(dataPrefix, "")] = collection[key];

                        return dict;
                    });

            if (data.Any())
                result["data"] = data;

            return !result.Any() ? null : JObject.FromObject(result);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to extract {fieldIdentifier} to JSON for menu item with {id} with {description}", fieldIdentifier, item.Metadata.Id, description);

            return null;
        }
    }
}
