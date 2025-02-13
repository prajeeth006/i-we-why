using System.Collections.Generic;

namespace Frontend.Vanilla.Features.Base;

internal interface IContentProvider<out T>
{
    string StaticContentPath { get; }
    T GetContent(string itemId, IReadOnlyDictionary<string, string> templateMetaData);
    string ResolveMessage(Dictionary<string, string> replacableKeysDictionary, string msgItem);
}
