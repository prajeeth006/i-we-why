using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Content;

public sealed class ContentMetadataDto(
    Uri sitecoreHost,
    IEnumerable<SelectItem> cultures,
    IEnumerable<SelectItem> pathRelativities,
    IEnumerable<SelectItem> dslEvaluations)
{
    public Uri SitecoreHost { get; } = sitecoreHost;
    public IReadOnlyList<SelectItem> Cultures { get; } = cultures.ToList();
    public IReadOnlyList<SelectItem> PathRelativities { get; } = pathRelativities.ToList();
    public IReadOnlyList<SelectItem> DslEvaluations { get; } = dslEvaluations.ToList();
}
