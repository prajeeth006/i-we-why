using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Flags;

internal sealed class FlagsClientConfigProvider(IContentService contentService) : LambdaClientConfigProvider("vnFlags", async cancellationToken =>
 {
     var flagsSet = await contentService.GetChildrenAsync<IPCImage>(AppPlugin.ContentRoot + $"/flags", cancellationToken, new ContentLoadOptions() { PrefetchDepth = 2, BypassChildrenCache = true, BypassPrefetchedProcessing = true, DslEvaluation = DslEvaluation.FullOnServer });

     return new
     {
         flags = flagsSet.NullToEmpty().ToDictionary(f => f.Parameters.GetValue("name")?.ToLower() ?? f.Metadata.Id.ItemName, f => f.Image?.Src),
     };
 })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
