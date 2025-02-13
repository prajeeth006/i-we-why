using System.Collections.Generic;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Defines logic for particular data stored in related fallback file.
/// </summary>
internal interface IFallbackFileDataHandler<TData>
{
    RootedPath? Path { get; }
    IReadOnlyList<DynaConParameter> Parameters { get; }
    TData Deserialize(FallbackDto dto);
    FallbackDto Serialize(TData data);
}
