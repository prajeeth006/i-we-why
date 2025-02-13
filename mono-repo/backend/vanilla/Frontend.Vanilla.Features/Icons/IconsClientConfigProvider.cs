using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LanguageSwitcher;
using Frontend.Vanilla.Features.Theming;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Features.Icons;

internal class IconsClientConfigProvider(IContentService contentService, IThemeResolver themeResolver) : LambdaClientConfigProvider("vnIconset", async cancellationToken =>
{
    var theme = themeResolver.GetTheme() ?? "default";
    var themeFolder = await contentService.GetAsync<IDocument>(AppPlugin.ContentRoot + $"/IconSet/Icons/{theme}", cancellationToken);
    var iconSet = await contentService.GetChildrenAsync<IDocument>(AppPlugin.ContentRoot + $"/IconSet/Icons/{themeFolder?.Metadata.Id.ItemName ?? "default"}", cancellationToken, new ContentLoadOptions() { PrefetchDepth = 2, BypassChildrenCache = true, BypassPrefetchedProcessing = true });
    var flagsSet = await contentService.GetChildrenAsync<IDocument>(AppPlugin.ContentRoot + $"/flags", cancellationToken, new ContentLoadOptions() { PrefetchDepth = 2, BypassChildrenCache = true, BypassPrefetchedProcessing = true });
    IReadOnlyList<IDocument> iconsCombined = iconSet.Concat(flagsSet).ToList();
    var vnIcons = iconsCombined.Select(TransformIcon);
    if (vnIcons.Any())
        return new { iconItems = vnIcons };

    return new { iconItems = Enumerable.Empty<VnIcon>() };
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    public static VnIcon TransformIcon(IDocument item)
    {
        VnIcon vnIcon = new VnIcon();
        switch (item)
        {
            case IMenuItem menuItem:
                vnIcon = Transform(menuItem);
                break;
            case IPCImage image:
                vnIcon = Transform(image);

                break;
            case IVnIcon icon:
                return Transform(icon);
        }

        return vnIcon;
    }

    public static VnIcon Transform(IVnIcon icon)
    {
        return new VnIcon
        {
            IconName = icon.Metadata.Id.ItemName,
            ExtraClass = icon.ExtraClass,
            FillColor = icon.FillColor,
            Image = icon.Image,
            Size = icon.Size,
            Title = icon.Title,
        };
    }

    // TODO: Remove this code once all icons are converted to IVnIcon
    public static VnIcon Transform(IMenuItem menuItem)
    {
        return new VnIcon
        {
            IconName = menuItem.Parameters.GetValue("name")?.ToLower() ?? menuItem.Metadata.Id.ItemName,
            ExtraClass = menuItem.Parameters.GetValue("extraClass"),
            FillColor = menuItem.Parameters.GetValue("fillColor"),
            Image = menuItem.Image,
            Size = menuItem.Parameters.GetValue("size"),
            Title = menuItem.Text,
            ImageUrl = menuItem.Image == null ? menuItem.Parameters.GetValue("urlId") : menuItem.Image.Src,
        };
    }

    // TODO: Remove this code once all icons are converted to IVnIcon
    public static VnIcon Transform(IPCImage image)
    {
        return new VnIcon
        {
            IconName = image.Parameters.GetValue("iconName") == null ? image.Metadata.Id.ItemName + "-flag" : image.Parameters.GetValue("iconName"),
            ExtraClass = image.Parameters.GetValue("extraClass"),
            FillColor = image.Parameters.GetValue("fillColor"),
            Image = image.Image,
            Size = image.Parameters.GetValue("size"),
            Title = image.Title,
            ImageUrl = image.Image == null ? image.Parameters.GetValue("urlId") : image.Image.Src,
        };
    }
}
