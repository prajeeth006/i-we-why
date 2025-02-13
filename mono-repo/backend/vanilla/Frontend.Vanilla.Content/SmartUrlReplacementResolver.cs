using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Content;

internal interface ISmartUrlReplacementResolver
{
    IEnumerable<string> Resolve();
}

internal sealed class DefaultSmartUrlReplacementResolver : ISmartUrlReplacementResolver
{
    public IEnumerable<string> Resolve() => Enumerable.Empty<string>();
}
